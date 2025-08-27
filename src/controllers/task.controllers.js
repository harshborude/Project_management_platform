import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .staus(201)
    .json(new ApiResponse(201, tasks, "Task fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .staus(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  const files = req.files || [];

  // Find the task by ID first
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Authorization check: Only the user who assigned the task can update it
  if (task.assignedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  // Create an object with the fields to be updated
  const updatedFields = {
    title: title || task.title,
    description: description || task.description,
    status: status || task.status,
  };

  // If a new user is being assigned, update the assignedTo field
  if (assignedTo) {
    updatedFields.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  } else {
    // If assignedTo is explicitly set to null/undefined, clear it
    updatedFields.assignedTo = null;
  }

  // Process new attachments
  const newAttachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.originalname}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  // Append new attachments to the existing ones
  updatedFields.attachments = [...task.attachments, ...newAttachments];

  // Update the task in the database
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: updatedFields },
    { new: true, runValidators: true }
  ).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});
const deleteTask = asyncHandler(async (req, res) => {
  //chai
});
const createSubTask = asyncHandler(async (req, res) => {
  //chai
});
const updateSubTask = asyncHandler(async (req, res) => {
  //chai
});
const deleteSubTask = asyncHandler(async (req, res) => {
  //chai
});

export {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
