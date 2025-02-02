const Tag = require("../models/tags");
const Question = require("../models/questions");

const parseTags = (search) => {
  return (search.match(/\[([^\]]+)\]/g) || []).map((word) => word.slice(1, -1));
};

const parseKeyword = (search) => {
  return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

const checkKeywordInQuestion = (q, keywordlist) => {
  for (let w of keywordlist) {
    if (
      q.title.toLocaleLowerCase().includes(w.toLocaleLowerCase()) ||
      q.description.toLocaleLowerCase().includes(w.toLocaleLowerCase())
    ) {
      return true;
    }
  }
  return false;
};

const checkTagInQuestion = (q, taglist) => {
  for (let tag of taglist) {
    for (let t of q.tags) {
      //   let tagName = await getTagById(t._id.toString());
      if (tag.toLocaleLowerCase() == t.name) {
        return true;
      }
    }
  }

  return false;
};

const addTag = async (tname) => {
  try {
    let tag = await Tag.findOne({ name: tname });
    if (tag != null) {
      return tag._id;
    } else {
      const newTag = new Tag({ name: tname });
      return (await newTag.save())._id;
    }
  } catch (err) {
    return Error("Could not add tag. ");
  }
};

const sortByActiveOrder = (qList) => {
  // sort each questions answers so that newest answer is at 0th position
  qList = qList.map((question) => {
    question.answers.sort((a, b) => {
      const dateA = new Date(a.ans_date_time);
      const dateB = new Date(b.ans_date_time);
      return dateB - dateA;
    });
    return question;
  });

  // finally sort based on most recent answer
  qList.sort((a, b) => {
    if (a.answers.length == 0) return 1;
    if (b.answers.length == 0) return -1;
    const dateA = new Date(a.answers[0]?.ans_date_time);
    const dateB = new Date(b.answers[0]?.ans_date_time);
    return dateB - dateA;
  });

  return qList;
};

const getQuestionsByOrder = async (order = "active") => {
  try {
    let query = Question.find({})
      .populate("answers")
      .populate({ path: "tags" })
      .populate({
        path: "asked_by",
      });

    let questions = await query.exec();

    // default sort order will always be "newest"
    questions.sort((a, b) => {
      const dateA = new Date(a.ask_date_time);
      const dateB = new Date(b.ask_date_time);
      return dateB - dateA;
    });

    switch (order) {
      case "newest":
        return questions;
      case "active":
        return sortByActiveOrder(questions);
      case "unanswered":
        questions = questions.filter(
          (question) => question.answers.length == 0
        );
        return questions;
    }
  } catch (err) {
    return Error(`Error in extracting questions: ${err}`);
  }
};

const filterQuestionsBySearch = (qlist = [], search = "") => {
  let searchTags = parseTags(search);
  let searchKeyword = parseKeyword(search);
  const res = qlist.filter((q) => {
    if (searchKeyword.length == 0 && searchTags.length == 0) {
      return true;
    } else if (searchKeyword.length == 0) {
      return checkTagInQuestion(q, searchTags);
    } else if (searchTags.length == 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    } else {
      return (
        checkKeywordInQuestion(q, searchKeyword) ||
        checkTagInQuestion(q, searchTags)
      );
    }
  });

  return res;
};

const getTop10Questions = async () => {
  return await Question.find()
    .populate("tags")
    .populate("asked_by")
    .populate("answers")
    .sort({ views: -1 })
    .limit(10)
    .exec();
};

module.exports = {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  getTop10Questions,
};
