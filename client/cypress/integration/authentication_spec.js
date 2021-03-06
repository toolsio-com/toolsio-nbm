describe("Authentication", function() {
  // creates a closure around 'account'
  let account;

  before(function() {
    // redefine account
    account = {
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
  });

  it("Sign up", function() {
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
    cy.url().should("include", "/login");
  });

  beforeEach(function() {
    Cypress.Cookies.preserveOnce("currentAccount");
  });

  it("Sign in", function() {
    cy.visit(`http://${account.subdomain}.lvh.me:3000/login`);

    // we should be redirected to /login
    cy.url().should("include", "/login");

    cy.get("input[name=email]").type(account.email);
    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${account.password}{enter}`);

    // we should be redirected to /dashboard
    cy.url().should("include", "/dashboard");
  });

  it("Logout", function() {
    cy.visit("/logout");

    // we should be redirected to /login
    cy.url().should("include", "/");
  });
});
