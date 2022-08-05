import { Allow, Entity, Fields, IdEntity, Validators } from "remult";
import { Roles } from "./Role";

@Entity("tasks", {
  // allowApiCrud: true,
  // allowApiCrud: Allow.authenticated,

  allowApiRead: Allow.authenticated,
  allowApiUpdate: Allow.authenticated,
  allowApiInsert: Roles.admin,
  allowApiDelete: Roles.admin,
})
export class Task extends IdEntity {
  @Fields.string({
    validate: Validators.required,
    allowApiUpdate: [Roles.admin, Roles.user],
  })
  title = "";

  @Fields.boolean()
  completed = false;
}
