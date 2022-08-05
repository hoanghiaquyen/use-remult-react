import { BackendMethod, Remult } from "remult";
import { Roles } from "./Role";
import { Task } from "./Task";

export default class TaskController {
  @BackendMethod({
    // allowed: true,
    // allowed: Allow.authenticated,

    allowed: Roles.admin,
  })
  static async setAll(completed: boolean, remult?: Remult) {
    const taskRepo = remult!.repo(Task);
    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed });
    }
  }
}
