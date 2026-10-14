import User from "../models/user.model.js";
export const sendFriendRequest = async (req, res) => {
    const { recipientEmail } = req.body;
    const requesterID = req.user?.id;
    //check if recipient exists or not?
    try {
        const recipient = await User.exists({ email: recipientEmail });
        // if not found
        if (!recipient) {
            res.status(404).json({ error: "Receiver not found." });
            return;
        }
        if (recipient._id.toString() === requesterID) {
            res.status(400).json({ error: "self-request." });
            return;
        }
        //   const request: IFriendship = {
        //     recipient: recipient,
        //     requester: requesterID,
        //   };
        return res.json({ message: "working", data: recipient });
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err });
    }
};
