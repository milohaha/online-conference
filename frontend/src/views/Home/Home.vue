<template>
  <div id="home">
    <b-nav tabs align="right">
      <b-nav-item active>Home</b-nav-item>
      <b-nav-item>Link</b-nav-item>
      <b-nav-item>Another Link</b-nav-item>
      <b-nav-item disabled>Disabled</b-nav-item>
    </b-nav>
    <b-jumbotron id="title">
      <template v-slot:header>富媒体实时协作平台</template>
      <template v-slot:lead>
        让线上会议室成为可能
      </template>
    </b-jumbotron>
    <div>
      <b-button pill variant="outline-success" to="/login" id="loginbtn">登录</b-button>
    </div>
    <div>
      <b-button variant="link" to="/register" id="registerbtn">点我注册</b-button>
    </div>
  </div>
</template>
<style scoped>
#home {
  background-image: url("../../assets/picture/bkgdpic.png");
  background-repeat: no-repeat;
  background-color: #04294f;
  height: 800px;
  color: #fff;
  font-family: 字魂27号-布丁体, Helvetica, Arial, Verdana, Tahoma, sans-serif;
}
#title {
  margin-left: auto;
  margin-right: 100px;
  margin-top: 200px;
  width: fit-content;
}
div + div {
  display: flex;
}
#loginbtn {
  margin-left: auto;
  margin-right: 350px;
  margin-top: 20px;
}
#registerbtn {
  margin-left: auto;
  margin-right: 332px;
}
</style>
