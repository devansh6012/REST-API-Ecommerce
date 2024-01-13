import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Auth user & get token
// POST /api/users/login
// access: Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email })
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
    else {
        res.status(401);
        next({ message: 'Invalid email or password' })
    }
}

// Register user
// POST /api/users
// access: Public
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        next({message: 'User already exists'});
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        next({message: 'Invalid user data'})
    }
}

// Logout user / clear cookie
// POST /api/users/logout
// access: Private
const logoutUser = async (req, res) => {
    // Clearing cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    
    res.status(200).json({message: 'logged out successfully'})
}

// Get user profile
// GET /api/users/profile
// access: private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }
}

// Upadate user profile
// PUT /api/users/profile
// access: private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }
    else {
        res.status(404);
        next({message: 'User not found'});
    }
}

// Get users
// GET /api/users/
// access: private/admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}

// Get user by id
// GET /api/users/:id
// access: private/admin
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user) {
        res.status(200).json(user);
    }
    else {
        res.status(404);
        next({message: 'User not found'});
    }
}

// Delete user
// DELETE /api/users/:id
// access: private/admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        if(user.isAdmin) {
            res.status(400);
            next({message: 'Cannot delete Admin user'});
        }
        await User.deleteOne({ _id: user._id});
        res.status(200).json({message: 'User deleted successfully'});
    } else {
        res.status(404);
        next({message: 'User not found'});
    }
}

// update user
// PUT /api/users/:id
// access: private/admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404);
        next({message: 'User not found'});
    }
}

export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}