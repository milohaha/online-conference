it('should can be visited', () => {
  cy.visit('http://localhost:8080')
})
describe('test data prepare.....', () => {

})
describe('Home Page', () => {
  describe('Home Display', () => {
    it('should have title and message', () => {
      cy.get('.title').contains('富媒体实时协作平台')
      cy.get('.title').contains('让线上会议室成为可能')
    })
    it('should have login button', () => {
      cy.get('.login-btn').should('be.visible')
    })
    it('should have register button', () => {
      cy.get('.register-btn').should('be.visible')
    })
  })
})
describe('Register Page', () => {
  describe('Register Display', () => {
    it('the register link should can be click', () => {
      cy.get('.register-btn').click()
    })
    it('should have email input', () => {
      cy.get('.input-group-email').should('be.visible')
    })
    it('should have username input', () => {
      cy.get('.input-group-user-name').should('be.visible')
    })
    it('should have password input', () => {
      cy.get('.input-group-password').should('be.visible')
    })
    it('should have password check input', () => {
      cy.get('.input-group-password-check').should('be.visible')
    })
    it('should have submit button', () => {
      cy.get('.btn').contains('注册').should('be.visible')
    })
    it('should have back button', () => {
      cy.get('.btn').contains('返回').should('be.visible')
    })
  })
  describe('Input Check', () => {
    it('email format check', () => {
      cy.get('.input-group-email').find('input').clear()
      cy.get('.input-group-email').find('input').type('myemail@.com')
      cy.get('.input-group-email').find('.invalid-feedback').contains('请输入正确的邮箱格式')
      cy.get('.input-group-email').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-email').find('.valid-feedback').should('not.be.visible')
      cy.get('.input-group-email').find('input').clear()
      cy.get('.input-group-email').find('input').type('@qq.com')
      cy.get('.input-group-email').find('.invalid-feedback').contains('请输入正确的邮箱格式')
      cy.get('.input-group-email').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-email').find('.valid-feedback').should('not.be.visible')
      cy.get('.input-group-email').find('input').clear()
      cy.get('.input-group-email').find('input').type('myemail@qq.com')
      cy.get('.input-group-email').find('.valid-feedback').contains('符合要求')
      cy.get('.input-group-email').find('.invalid-feedback').should('not.be.visible')
      cy.get('.input-group-email').find('.valid-feedback').should('be.visible')
    })
    it('username length check', () => {
      cy.get('.input-group-user-name').find('input').clear()
      cy.get('.input-group-user-name').find('input').type('my')
      cy.get('.input-group-user-name').find('.invalid-feedback').contains('你的用户名长度必须在5-12个字符之间')
      cy.get('.input-group-user-name').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-user-name').find('.valid-feedback').should('not.be.visible')
      cy.get('.input-group-user-name').find('input').type('username')
      cy.get('.input-group-user-name').find('.valid-feedback').contains('符合要求')
      cy.get('.input-group-user-name').find('.invalid-feedback').should('not.be.visible')
      cy.get('.input-group-user-name').find('.valid-feedback').should('be.visible')
    })
    it('password character check', () => {
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('my/password')
      cy.get('.input-group-password').find('.invalid-feedback').contains('你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线')
      cy.get('.input-group-password').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-password').find('.valid-feedback').should('not.be.visible')
    })
    it('password length check', () => {
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('my')
      cy.get('.input-group-password').find('.invalid-feedback').contains('你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线')
      cy.get('.input-group-password').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-password').find('.valid-feedback').should('not.be.visible')
      cy.get('.input-group-password').find('input').type('password')
      cy.get('.input-group-password').find('.valid-feedback').contains('符合要求')
      cy.get('.input-group-password').find('.invalid-feedback').should('not.be.visible')
      cy.get('.input-group-password').find('.valid-feedback').should('be.visible')
    })
    it('password same check', () => {
      cy.get('.input-group-password-check').find('input').clear()
      cy.get('.input-group-password-check').find('input').type('mypassworaa')
      cy.get('.input-group-password-check').find('.invalid-feedback').contains('密码不一致')
      cy.get('.input-group-password-check').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-password-check').find('.valid-feedback').should('not.be.visible')
      cy.get('.input-group-password-check').find('input').clear()
      cy.get('.input-group-password-check').find('input').type('mypassword')
      cy.get('.input-group-password-check').find('.valid-feedback').contains('符合要求')
      cy.get('.input-group-password-check').find('.invalid-feedback').should('not.be.visible')
      cy.get('.input-group-password-check').find('.valid-feedback').should('be.visible')
    })
  })
  describe('Register Message', () => {
    it('have empty input message', () => {
      cy.get('.input-group-user-name').find('input').clear()
      cy.get('.btn').contains('注册').click()
      cy.get('.input-group-user-name').find('input').type('Snow_bread')
      cy.get('.input-group-email').find('input').clear()
      cy.get('.input-group-email').find('input').type('123@qq.com')
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('12345678')
      cy.get('.input-group-password-check').find('input').clear()
      cy.get('.input-group-password-check').find('input').type('12345678')
      cy.get('.btn').contains('注册').click()
    })
  })
  describe('Back To Home', () => {
    it('back to home page', () => {
      cy.get('.btn').contains('返回').click()
    })
  })
})
