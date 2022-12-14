"use strict"

let logoutButton = new LogoutButton;
let ratesBoard = new RatesBoard;
let moneyManager = new MoneyManager;
let favoritesWidget = new FavoritesWidget;


logoutButton.action = () => ApiConnector.logout(callback(window.location.reload.bind(window.location)));

let callback = method => response => (response.success) && method(response.data);
ApiConnector.current(callback(ProfileWidget.showProfile));

function updateTable(data) {
   ratesBoard.clearTable();
   ratesBoard.fillTable(data);
}

let updateStocks = () => ApiConnector.getStocks(callback(updateTable));
ApiConnector.getFavorites(callback(updateFavorites));
updateStocks();
setInterval(updateStocks, 60000);

function updateFavorites(data) {
   favoritesWidget.clearTable(data);
   favoritesWidget.fillTable(data);
   moneyManager.updateUsersList(data);
}

let requestHandler = (showFunc, errorMessageBox, method, message) => data => method(data, response => {
   if (response.success) {
      showFunc(response.data);
      let totalMessage = response.request ? `${response.data}:` + message : message;
      errorMessageBox.setMessage(response.success, totalMessage);
   } else {
      errorMessageBox.setMessage(response.success, response.error);
   }
});

moneyManager.addMoneyCallback = requestHandler(ProfileWidget.showProfile, moneyManager, ApiConnector.addMoney, "Ваш баланс пополнен!");
moneyManager.conversionMoneyCallback = requestHandler(ProfileWidget.showProfile, moneyManager, ApiConnector.convertMoney, 'Конвертирование валюты выполнено!');
moneyManager.sendMoneyCallback = requestHandler(ProfileWidget.showProfile, moneyManager, ApiConnector.transferMoney, 'Перевод выполнен');
favoritesWidget.addUserCallback = requestHandler(updateFavorites, favoritesWidget, ApiConnector.addUserToFavorites, 'Пользователь добавлен!');
favoritesWidget.removeUserCallback = requestHandler(updateFavorites, favoritesWidget, ApiConnector.removeUserFromFavorites, 'Пользователь удален!');