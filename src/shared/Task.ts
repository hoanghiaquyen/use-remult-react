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
    allowApiUpdate: (remult) => {
      if (remult.isAllowed(Roles.admin) || remult.isAllowed(Roles.user)) {
        return true;
      }
      throw "Role not accept";
    },
  })
  title = "";

  @Fields.boolean()
  completed = false;
}
