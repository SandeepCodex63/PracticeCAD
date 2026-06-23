const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const { uploadImage } = require('../services/cloudinaryService');
const fs = require('fs');

// @desc    Create a new quiz
// @route   POST /api/v1/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  const { title, description, category, difficulty, startDate, endDate, minAnswer, maxAnswer, questions } = req.body;

  const cleanLocalFiles = () => {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  };

  try {
    if (!title || !category || !startDate || !endDate) {
      cleanLocalFiles();
      return res.status(400).json({ success: false, message: 'Please provide all required quiz fields.' });
    }

    let finalQuestions = [];

    if (questions) {
      const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Quiz must contain at least one question.' });
      }

      let fileIndex = 0;
      for (let i = 0; i < parsedQuestions.length; i++) {
        const q = parsedQuestions[i];
        if (!q.imageUrl) {
          const file = req.files && req.files[fileIndex];
          if (!file) {
            cleanLocalFiles();
            return res.status(400).json({ success: false, message: `Missing image file for question at index ${i}` });
          }
          const imageUrl = await uploadImage(file);
          q.imageUrl = imageUrl;
          fileIndex++;
        }
        if (q.minAnswer === undefined || q.maxAnswer === undefined) {
          cleanLocalFiles();
          return res.status(400).json({ success: false, message: `Question at index ${i} is missing minAnswer or maxAnswer.` });
        }
        if (Number(q.minAnswer) > Number(q.maxAnswer)) {
          cleanLocalFiles();
          return res.status(400).json({ success: false, message: `Question at index ${i}: minimum answer cannot be larger than maximum answer.` });
        }
        finalQuestions.push({
          imageUrl: q.imageUrl,
          minAnswer: Number(q.minAnswer),
          maxAnswer: Number(q.maxAnswer),
          objective: q.objective || ''
        });
      }
    } else {
      // Fallback to legacy single question
      if (minAnswer === undefined || maxAnswer === undefined) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Please provide question answers.' });
      }
      if (Number(minAnswer) > Number(maxAnswer)) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Minimum answer cannot be larger than maximum answer.' });
      }
      const file = req.files && req.files[0];
      if (!file) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Please upload a quiz image.' });
      }
      const imageUrl = await uploadImage(file);
      finalQuestions.push({
        imageUrl,
        minAnswer: Number(minAnswer),
        maxAnswer: Number(maxAnswer),
        objective: description || ''
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      imageUrl: finalQuestions[0]?.imageUrl,
      minAnswer: finalQuestions[0]?.minAnswer,
      maxAnswer: finalQuestions[0]?.maxAnswer,
      questions: finalQuestions,
      difficulty,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      quiz
    });
  } catch (error) {
    console.error('Create Quiz Error:', error);
    cleanLocalFiles();
    return res.status(500).json({ success: false, message: 'Server Error creating quiz.' });
  }
};

// @desc    Edit a quiz
// @route   PUT /api/v1/quizzes/:id
// @access  Private/Admin
const editQuiz = async (req, res) => {
  const quizId = req.params.id;
  const { title, description, category, difficulty, startDate, endDate, minAnswer, maxAnswer, questions } = req.body;

  const cleanLocalFiles = () => {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
  };

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      cleanLocalFiles();
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Update simple fields
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (category) quiz.category = category;
    if (difficulty) quiz.difficulty = difficulty;
    if (startDate) quiz.startDate = new Date(startDate);
    if (endDate) quiz.endDate = new Date(endDate);

    if (questions) {
      const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Quiz must contain at least one question.' });
      }

      let fileIndex = 0;
      let finalQuestions = [];
      for (let i = 0; i < parsedQuestions.length; i++) {
        const q = parsedQuestions[i];
        if (!q.imageUrl) {
          const file = req.files && req.files[fileIndex];
          if (!file) {
            cleanLocalFiles();
            return res.status(400).json({ success: false, message: `Missing image file for question at index ${i}` });
          }
          const imageUrl = await uploadImage(file);
          q.imageUrl = imageUrl;
          fileIndex++;
        }
        if (q.minAnswer === undefined || q.maxAnswer === undefined) {
          cleanLocalFiles();
          return res.status(400).json({ success: false, message: `Question at index ${i} is missing minAnswer or maxAnswer.` });
        }
        if (Number(q.minAnswer) > Number(q.maxAnswer)) {
          cleanLocalFiles();
          return res.status(400).json({ success: false, message: `Question at index ${i}: minimum answer cannot be larger than maximum answer.` });
        }
        finalQuestions.push({
          _id: q._id,
          imageUrl: q.imageUrl,
          minAnswer: Number(q.minAnswer),
          maxAnswer: Number(q.maxAnswer),
          objective: q.objective || ''
        });
      }
      quiz.questions = finalQuestions;
      quiz.imageUrl = finalQuestions[0]?.imageUrl;
      quiz.minAnswer = finalQuestions[0]?.minAnswer;
      quiz.maxAnswer = finalQuestions[0]?.maxAnswer;
    } else {
      // Legacy updates
      if (minAnswer !== undefined) quiz.minAnswer = Number(minAnswer);
      if (maxAnswer !== undefined) quiz.maxAnswer = Number(maxAnswer);

      if (quiz.minAnswer > quiz.maxAnswer) {
        cleanLocalFiles();
        return res.status(400).json({ success: false, message: 'Minimum answer cannot be larger than maximum answer.' });
      }

      if (req.files && req.files[0]) {
        const imageUrl = await uploadImage(req.files[0]);
        quiz.imageUrl = imageUrl;
      }

      if (quiz.questions && quiz.questions.length > 0) {
        quiz.questions[0].minAnswer = quiz.minAnswer;
        quiz.questions[0].maxAnswer = quiz.maxAnswer;
        if (quiz.imageUrl) quiz.questions[0].imageUrl = quiz.imageUrl;
      }
    }

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: 'Quiz updated successfully.',
      quiz
    });
  } catch (error) {
    console.error('Update Quiz Error:', error);
    cleanLocalFiles();
    return res.status(500).json({ success: false, message: 'Server Error updating quiz.' });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/v1/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    await Quiz.deleteOne({ _id: quizId });
    // Clear associated attempts
    await Attempt.deleteMany({ quizId });

    return res.status(200).json({
      success: true,
      message: 'Quiz and its history deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Quiz Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error deleting quiz.' });
  }
};

// @desc    Get all quizzes (with attempt statuses)
// @route   GET /api/v1/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    let quizzes;

    // Admins can see all quizzes including answers
    if (isAdmin) {
      quizzes = await Quiz.find({}).sort({ createdAt: -1 });
    } else {
      // Participants see active quizzes (answer ranges are stripped out via select or map)
      quizzes = await Quiz.find({}).select('-minAnswer -maxAnswer -questions.minAnswer -questions.maxAnswer').sort({ createdAt: -1 });
    }

    // Find all attempts by current user to attach attempt status
    const attempts = await Attempt.find({ userId: req.user.id });
    const attemptedQuizIds = attempts.map(a => a.quizId.toString());

    const formattedQuizzes = quizzes.map(quiz => {
      const q = quiz.toObject();
      q.attempted = attemptedQuizIds.includes(quiz._id.toString());
      if (q.attempted) {
        // If already attempted, find the attempt data and attach it (e.g. score correctness)
        const userAttempt = attempts.find(a => a.quizId.toString() === quiz._id.toString());
        q.attemptDetails = {
          correct: userAttempt.correct,
          timeTaken: userAttempt.timeTaken,
          submittedAt: userAttempt.submittedAt,
          answer: userAttempt.answer
        };
      }
      return q;
    });

    return res.status(200).json({
      success: true,
      quizzes: formattedQuizzes
    });
  } catch (error) {
    console.error('Get Quizzes Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching quizzes.' });
  }
};

// @desc    Get a single quiz details
// @route   GET /api/v1/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  const quizId = req.params.id;

  try {
    const isAdmin = req.user.role === 'admin';
    
    // Check if user already attempted this quiz
    const attempt = await Attempt.findOne({ userId: req.user.id, quizId });
    const isCompleted = attempt && attempt.correct;

    let quiz;
    if (isAdmin || isCompleted) {
      quiz = await Quiz.findById(quizId);
    } else {
      quiz = await Quiz.findById(quizId).select('-minAnswer -maxAnswer -questions.minAnswer -questions.maxAnswer');
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const formattedQuiz = quiz.toObject();
    formattedQuiz.attempted = !!attempt;
    
    if (attempt) {
      formattedQuiz.attemptDetails = {
        correct: attempt.correct,
        timeTaken: attempt.timeTaken,
        submittedAt: attempt.submittedAt,
        answer: attempt.answer,
        answers: attempt.answers || []
      };
    }

    return res.status(200).json({
      success: true,
      quiz: formattedQuiz
    });
  } catch (error) {
    console.error('Get Quiz Details Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching quiz details.' });
  }
};

module.exports = {
  createQuiz,
  editQuiz,
  deleteQuiz,
  getQuizzes,
  getQuizById
};
