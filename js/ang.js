var app = angular.module("app", []);

app.directive("nav", function () {
    return {
        restrict: "E",
        scope: { active: "@", split: "@" },
        template: "<div id='navBar'>" +
            "<a ng-repeat='link in links' href={{link.url}} target='_top'>" +
            "<div class='navButton'" +
            " ng-class='{activeNav : active == $index, navButton_right : $index >= split}'>" +
            "{{link.name}}</div></a></div>"
    };
});
