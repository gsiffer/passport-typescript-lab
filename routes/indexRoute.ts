import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { ensureAdminRole } from "../middleware/checkRole";
import { getUserById } from "../controllers/userController";
import { MemoryStore } from 'express-session';

router.get("/", (req, res) => {
  res.send('<h3>Welcome</h3><a href="/auth/login" alt="">Login</a>');
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, ensureAdminRole, (req, res) => {
  const name = req.user?.name
  const sessionStore = req.sessionStore as MemoryStore;
  const array: {}[] = [];

  if (!(req.sessionStore instanceof MemoryStore)) {
    res.send('Session store is not MemoryStore');
    return;
  }

  sessionStore.all(function (error, sessions) {
    if (error) {
      res.send('Error retrieving sessions');
      return;
    }

    if (!sessions || Object.keys(sessions).length === 0) {
      res.send('No sessions found');
      return;
    }

    Object.keys(sessions).forEach(sessionCode => {
      if (sessionCode.length > 0) {
        const userID = sessions[sessionCode]?.passport?.user;
        if (userID) {
          const userName = getUserById(userID)?.name;
          array.push({ sessionCode, userID, userName });
        }
      }
    });

    console.log("Sessions:", array);
    res.render('admin', { name, array });
  });
})

router.post("/revoke-session", (req, res) => {
  const sessionCode = req.body.sessionCode;
  console.log(sessionCode)
  // Revoke the session with the given session code
  req.sessionStore.destroy(sessionCode, (err) => {
    if (err) {
      console.log(err);
      res.send('Error revoking session');
    } else {
      res.redirect("/admin");
    }
  });
});

export default router;

