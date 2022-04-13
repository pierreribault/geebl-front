import { authHeader } from "./authservice/auth-header";
import { userService } from "./authservice/user.service";

export const paymentService = {
  confirmPayment,
};

function confirmPayment(intentionId) {
  if (!intentionId) return;

  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ intentionId }),
  };

  return fetch(
    `${process.env.paymentdomain}/transactions`,
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        userService.logout();
        location.reload(true);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
