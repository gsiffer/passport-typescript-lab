import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { userModel } from '../../models/userModel';
import { Request } from "express";
import { GitHubProfile } from "../../interfaces/gitHubProfile"


const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.CLIENT_ID || '',
        clientSecret: process.env.CLIENT_SECRET || '',
        callbackURL: process.env.CALLBACK_URL || '',
        passReqToCallback: true,
    },

    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: Express.User | false, options?: any) => void) => {
        try {
            if (profile) {
                const user = { id: Number(profile.id), name: profile.displayName, email: profile.emails[0].value, password: "", role: "user" }
                if (!userModel.findExternalUser(user.email)) {
                    userModel.addUser(user)
                }
                done(null, user)
            } else {
                done(null, false, {
                    message: "Invalid User",
                });
            }
        } catch (error: any) {
            done(null, false, {
                message: error.message,
            });
        }

        console.log("id: ", profile.id)
        console.log("name: ", profile.displayName)
        console.log("email: ", profile.emails[0].value)
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;


