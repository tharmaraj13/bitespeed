import { Router } from "express";
import contactController from "../controllers/contactController";

const contact = Router();

contact.post("/identify", contactController.contactList);

export default contact;
