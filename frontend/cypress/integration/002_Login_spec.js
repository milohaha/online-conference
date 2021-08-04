it('should can be visited', () => {
  cy.visit('http://localhost:8080')
})
describe('Login Page', () => {
  describe('Login Display', () => {
    it('the Login button should can be click', () => {
      cy.get('.login-btn').click()
    })
    it('should have username input', () => {
      cy.get('.input-group-user-name').should('be.visible')
    })
    it('should have password input', () => {
      cy.get('.input-group-password').should('be.visible')
    })
    it('should have submit button', () => {
      cy.get('.btn').contains('登录').should('be.visible')
    })
    it('should have back button', () => {
      cy.get('.btn').contains('返回').should('be.visible')
    })
  })
  describe('Input Check', () => {
    it('username length check', () => {
      cy.get('.input-group-user-name').find('input').clear()
      cy.get('.input-group-user-name').find('input').type('my')
      cy.get('.input-group-user-name').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-user-name').find('input').type('username')
      cy.get('.input-group-user-name').find('.invalid-feedback').should('not.be.visible')
    })
    it('password character check', () => {
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('my/password')
      cy.get('.input-group-password').find('.invalid-feedback').contains('你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线')
      cy.get('.input-group-password').find('.invalid-feedback').should('be.visible')
    })
    it('password length check', () => {
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('my')
      cy.get('.input-group-password').find('.invalid-feedback').contains('你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线')
      cy.get('.input-group-password').find('.invalid-feedback').should('be.visible')
      cy.get('.input-group-password').find('input').type('password')
      cy.get('.input-group-password').find('.invalid-feedback').should('not.be.visible')
    })
  })
  describe('Login test', () => {
    it('login test', () => {
      cy.get('.btn').contains('登录').click()
      cy.get('.alert').contains('用户名不存在或密码错误')
      cy.get('.input-group-user-name').find('input').clear()
      cy.get('.input-group-user-name').find('input').type('Snow_bread')
      cy.get('.input-group-password').find('input').clear()
      cy.get('.input-group-password').find('input').type('12345678')
      cy.get('.btn').contains('登录').click()
    })
  })
  describe('DELETE RELATIVE DATA', () => {
    it('DELETE USERS', () => {
      cy.request({
        url: 'http://localhost:3000/deleteObjects',
        method: 'POST',
        headers: '',
        body: { model: 'User', condition: {} }
      }).then(message => {
        cy.log(message)
      })
    })
  })
})
