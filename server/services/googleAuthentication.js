import User from '../models/User.js';

export const findOrCreateGoogleUser = async (profile) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });
            await user.save();
        }
        return user;
    } catch (error) {
        console.error('Error in Google Authentication:', error);
        throw error;
    }
};
