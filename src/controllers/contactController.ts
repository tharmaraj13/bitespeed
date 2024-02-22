import { Op } from "sequelize";
import Contact from "../database/models/contact";
import { Validator } from "node-input-validator";

class ContactController {
  async contactList(req: any, res: any) {
    try {
      const payload = req.body;
      const v = new Validator(payload, {
        email: "required|nullable",
        phoneNumber: "required|nullable",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(200).json({
          success: false,
          errors: v.errors,
        });
      } else {
        if (payload.email == null && payload.phoneNumber == null) {
          return res.status(200).json({
            success: false,
            errors: "At least One value is mandatory (Email or Phone Number)",
          });
        }

        let where = Object();
        where[Op.or] = [
          { email: payload.email || null },
          { phoneNumber: payload.phoneNumber || null },
        ];

        let contacts = await Contact.findAll({
          where: where,
        });
        const linkedIds = contacts
          .filter((contact: any) => contact.linkPrecedence === "secondary")
          .map((c: any) => c.linkedId);

        let primaryContacts = await Contact.findAll({
          where: {
            id: linkedIds,
            linkPrecedence: "primary",
          },
        });
        contacts = [...primaryContacts, ...contacts];
        contacts.sort((a: any, b: any) => a.createdAt - b.createdAt);

        let primaryContact: any = contacts.find(
          (c: any) => c.linkPrecedence === "primary"
        );
        if (!primaryContact) {
          primaryContact = await Contact.create({
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            linkPrecedence: "primary",
          });
          return res.json({
            contact: {
              primaryContatctId: primaryContact.id,
              emails: [primaryContact.email],
              phoneNumbers: [primaryContact.phoneNumber],
              secondaryContactIds: [],
            },
          });
        }
        if (payload.email != null && payload.phoneNumber != null) {
          if (
            !(
              contacts.some((c: any) => c.email === payload.email) &&
              contacts.some((c: any) => c.phoneNumber === payload.phoneNumber)
            )
          ) {
            const newContact = await Contact.create({
              email: payload.email,
              phoneNumber: payload.phoneNumber,
              linkedId: primaryContact.id,
              linkPrecedence: "secondary",
            });
            contacts.push(newContact);
          }
        }
        const idsToUpdate = Array();
        contacts.forEach((c: any) => {
          if (c.id !== primaryContact.id) {
            idsToUpdate.push(c.id);
          }
        });
        await Contact.update(
          {
            linkedId: primaryContact.id,
            linkPrecedence: "secondary",
          },
          {
            where: { id: idsToUpdate },
          }
        );
        let secondaryContacts = await Contact.findAll({
          where: {
            linkedId: primaryContact.id,
            linkPrecedence: "secondary",
          },
        });

        let emails = [
          ...new Set(
            [
              primaryContact.email,
              ...secondaryContacts.map((c: any) => c.email),
            ].filter((c) => !!c)
          ),
        ];
        let phoneNumbers = [
          ...new Set(
            [
              primaryContact.phoneNumber,
              ...secondaryContacts.map((c: any) => c.phoneNumber),
            ].filter((c) => !!c)
          ),
        ];
        let secondaryContactIds = secondaryContacts.map((c: any) => c.id);
        return res.status(200).json({
          contact: {
            primaryContatctId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds,
          },
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

const contactController = new ContactController();
export default contactController;
