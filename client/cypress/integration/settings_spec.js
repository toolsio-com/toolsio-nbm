describe("Settings", function() {
  before(function() {
    // creates a closure around 'account'
    const account = {
      firstName: "Testa",
      lastName: "Testa",
      email: "testa@toolsio.com",
      password: "ppppp",
      industry: "IT",
      subdomain: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5)
    };

    cy.visit("/");

    cy.contains("Sign up").click();

    const { firstName, lastName, email, password, subdomain } = account;

    cy.get("input[name=firstName]").type(firstName);
    cy.get("input[name=lastName]").type(lastName);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);
    cy.get("div[name=industry]").click();
    cy.get("div[name=industry] .item:first-child").click();
    cy.get("input[name=subdomain]").type(subdomain);

    // submit
    cy.contains("Sign up").click();

    // we should be redirected to /login
    cy.visit(`http://${subdomain}.lvh.me:3000/login`);

    // login
    cy.get("input[name=email]").type(email);
    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${password}{enter}`);

    Cypress.Cookies.preserveOnce("currentAccount");

    // we should be redirected to /dashboard
    cy.url().should("include", `http://${subdomain}.lvh.me:3000/dashboard`);

    // go to settings
    cy.visit(`http://${account.subdomain}.lvh.me:3000/settings`);
  });

  beforeEach(function() {
    Cypress.Cookies.preserveOnce("currentAccount");
  });

  // creates a closure around 'account'
  it("Update Account settings", function() {
    cy.get("input[name=street]").type("Street 1");
    cy.get("input[name=postalCode]").type("1234");
    cy.get("select[name=rcrs-country]").select("Algeria");
    cy.get("select[name=rcrs-region]").select("Batna");

    // submit
    cy.get(".account")
      .contains("Update")
      .click();

    // we should be redirected to /settings
    cy.url().should("include", "/settings");

    // should contain Algeria
    cy.get("select[name=rcrs-country]").should("contain", "Algeria");
  });

  it("Update User setting", function() {
    cy.get("input[name=firstName]").type(" updated");

    // submit
    cy.get("form.profile")
      .contains("Update")
      .click();

    // we should be redirected to /settings
    cy.url().should("include", "/settings");

    // should contain Testa updated
    cy.get("input[name=firstName]").should("have.value", "Testa updated");
  });

  it("Update User password setting", function() {
    cy.get("input[name=currentPassword]").type("ppppp");
    cy.get("input[name=newPassword]").type("updated");
    cy.get("input[name=confirmNewPassword]").type("updated");

    // submit
    cy.get("form.password")
      .contains("Update")
      .click();

    // we should be redirected to /settings
    cy.url().should("include", "/settings");

    // should contain Profile is updated
    cy.get(".ui.message p").should("contain", "Password is updated!");
  });

  xit("Delete setting", function() {
    cy.contains("Delete").click();

    // confirm delete
    cy.get(".actions > .ui.negative.button").click();

    // we should be redirected to /settings
    cy.url().should("include", "/");

    // should contain Your account is now...
    cy.get(".ui.message p]").should(
      "contain",
      "Your account is now deleted. Sorry to not see you again!"
    );
  });

  after(function() {
    cy.visit("/logout");

    // we should be redirected to /login
    cy.url().should("include", "/");
  });
});
