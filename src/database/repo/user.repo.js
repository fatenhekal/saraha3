import { userModel } from "../models/user.model.js";
import repo from "./base.repo.js";

let queries = repo(userModel);

export default queries;
