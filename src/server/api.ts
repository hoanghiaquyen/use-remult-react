import { remultExpress } from "remult/remult-express";
import { AuthController } from "../shared/AuthController";
import { Task } from "../shared/Task";
import TaskController from "../shared/TaskController";

export const api = remultExpress({
  entities: [Task],
  controllers: [TaskController, AuthController],
  initApi: async (remult) => {
    const taskRepo = remult.repo(Task);
    if ((await taskRepo.count()) === 0) {
      await taskRepo.insert([
        { title: "Task a" },
        { title: "Task b", completed: true },
        { title: "Task c" },
        { title: "Task d" },
        { title: "Task e", completed: true },
      ]);
    }
  },
});
