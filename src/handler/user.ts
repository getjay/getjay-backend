import {authRouter, router} from "../index";
import express from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {User} from "../database/entity/user";

export default class UserHandler {
    async initialize() {
        authRouter
            .get('/user/me', wrap(this.getMe))
            .get('/user/me/bookmarkedJobOffers', wrap(this.getMyBookmarks));
        router
            .get('/user/:id', wrap(this.getUser));
    }

    async getMe(req: express.Request, res: express.Response) {
        return (await req.getUser()).toIOwnUser();
    }

    async getMyBookmarks(req: express.Request, res: express.Response) {
        const user = await req.getUser();
        const bookmarks = await user.bookmarkedJobOffers;
        return bookmarks.map(a => a.toIJobOffer())
    }

    async getUser(req: express.Request, res: express.Response) {
        const id = req.params.id;
        if (!id) throw new HttpBadRequestError("Param ID not found!");

        const user = await User.findOne({id});
        if (!user) throw new HttpNotFoundError("User not found!");

        return user.toIUser()
    }
}
