<template>
  <div>
    <b-nav tabs>
      <b-nav-item active>Home</b-nav-item>
      <b-nav-item>Link</b-nav-item>
      <b-nav-item>Another Link</b-nav-item>
      <b-nav-item disabled>Disabled</b-nav-item>
    </b-nav>
    <b-jumbotron>
      <template v-slot:header>富媒体实时协作平台</template>

      <template v-slot:lead>
        让线上会议室成为可能
      </template>
    </b-jumbotron>
    <div>
      <b-button pill variant="outline-success" to="/login">登录</b-button>
    </div>
    <div>
      <b-button variant="link" to="/register">点我注册</b-button>
    </div>
  </div>
</template>
