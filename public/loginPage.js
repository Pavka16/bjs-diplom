"use strict"

let userForm = new UserForm();
let formFill = (method, errorMessageBox) => (data) =>
   method(data, (response) => response.success ? location.reload() : errorMessageBox(response.error)
   );

userForm.loginFormCallback = formFill(
   ApiConnector.login,
   userForm.setLoginErrorMessage.bind(userForm)
);

userForm.registerFormCallback = formFill(
   ApiConnector.register,
   userForm.setRegisterErrorMessage.bind(userForm)
);

ApiConnector.login(
   {
      login: "",
      password: "",
   },
)