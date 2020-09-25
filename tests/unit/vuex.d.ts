declare module 'vuex' {
  interface Context {
    fn: jest.Mock<unknown, unknown>
  }
}
