import { RouteObject } from "react-router-dom";
import Feed from "../pages/feed";
import Login from "../pages/login";
import Logout from "../pages/logout";
import Notifications from "../pages/notifications";
import Register from "../pages/register";
import Settings from "../pages/settings";
import SingleBlue from "../pages/singleblue";
import User from "../pages/user";
import Auth from "./Auth";

const Routes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    }, {
        path: '/register',
        element: <Register />
    }, {
    }, {
        path: '/',
        element: <Auth><Feed /></Auth>
    }, {
        path: '/blue/:repo/:cid',
        element: <Auth><SingleBlue /></Auth>
    }, {
        path: '/user/:did',
        element: <Auth><User /></Auth>
    }, {
    }, {
        path: '/user/:did/posts',
        element: <Auth><User /></Auth>
    }, {
    }, {
        path: '/user/:did/replies',
        element: <Auth><User /></Auth>
    }, {
    }, {
        path: '/user/:did/likes',
        element: <Auth><User /></Auth>
    }, {
    }, {
        path: '/user/:did/media',
        element: <Auth><User /></Auth>
    }, {
    }, {
        path: '/user/:did/blocks',
        element: <Auth><User /></Auth>
    }, {
        path: '/notifications',
        element: <Auth><Notifications /></Auth>
    }, {
    }, {
        path: '/settings',
        element: <Auth><Settings /></Auth>
    }, {
        path: '/logout',
        element: <Logout />
    }
]

export default Routes;