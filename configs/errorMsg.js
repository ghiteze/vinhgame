var errors = {
  user: {
    userName: {
      required: 'Username is required'
    },
    email: {
      required: 'Email is required',
      invalid: 'Invalid email'
    },
    userNameOrEmail: {
      required: 'Username or email is required',
      exists: 'Username or email is exists'
    },
    password: {
      required: 'Password is required',
      length: 'Password must great than or equal 6 letters',
      confirm: 'Password does not match'
    }
  }
}

module.exports = errors;