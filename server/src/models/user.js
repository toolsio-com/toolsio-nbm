import bcrypt from 'bcrypt'
import Promise from 'bluebird'
const SALT_WORK_FACTOR = 10

export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {     
        isEmail: { // checks for email format (foo@bar.com) 
          arg: true,
          msg: 'Invalid email format'
        }
      } 
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false
    },
    avatarUrl: {
      type: DataTypes.STRING,
      field: 'avatar_url'
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      field: 'is_confirmed'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      field: 'is_admin'
    }
  }, {
    hooks: {
      beforeValidate: (user, options) => {
        user.isAdmin = user.length === 0
        user.isConfirmed = user.length === 0
      },
      beforeCreate: (user, options) => {
        return new Promise(function(resolve, reject) {

          // only hash the password if it has been modified (or is new)
          if (!user.changed('password')) return 
      
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) return reject(err)

            // hash the password using our new salt
            return bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) return reject(err)
             
              // override the cleartext password with the hashed one
              user.password = hash
              resolve(hash)
            })
          })
        })
      }
    }
  })

  User.associate = (models) => {
    // M:M
    User.belongsToMany(models.Conversation, {
      through: 'participants',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    })
  }

  User.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    })
  }

  return User
}