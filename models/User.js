const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Authentication fields
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    
    // Profile fields for dashboard
    profile: {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function(value) {
                    return value < new Date();
                },
                message: 'Date of birth must be in the past'
            }
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
            unique: true
        },
        currentClass: {
            type: String,
            required: [true, 'Current academic class is required'],
            enum: {
                values: ['10th', '11th', '12th', 'Graduation 1st Year', 'Graduation 2nd Year', 'Graduation 3rd Year', 'Graduation Final Year', 'Post Graduation', 'Other'],
                message: 'Please select a valid academic class'
            }
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: ['Male', 'Female', 'Other']
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        interests: [{
            type: String,
            trim: true
        }],
        careerGoals: {
            type: String,
            trim: true,
            maxlength: [500, 'Career goals cannot exceed 500 characters']
        }
    },
    
    // System fields
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Creates createdAt and updatedAt automatically
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'profile.phoneNumber': 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
UserSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        profile: this.profile,
        role: this.role,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

// Calculate age from date of birth
UserSchema.virtual('profile.age').get(function() {
    if (this.profile.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.profile.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    return null;
});

module.exports = mongoose.model('User', UserSchema);
