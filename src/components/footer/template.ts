const t: Record<string, any> = {
  footTemplate1: `
<div class="foot-template1 dark-bg dark-border-color">
  <div class="template1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <div>
      <div class="title dark-white">联系方式</div>
      <div class="text dark-white-700">问题反馈：xjh22222228@gmail.com</div>
      <div class="text dark-white-700">微信授权：xjh22222228</div>
    </div>

    <div>
      <div class="title dark-white">网站信息</div>
      <div class="text dark-white-700">共收录$\{total}个网站</div>
      <div class="text">
        <a
          class="applyweb"
        >
          申请收录
        </a>
      </div>
    </div>

    <div>
      <div class="title dark-white">技术支持</div>
      <div class="text">
        <a
          href="https://github.com/xjh22222228/nav"
          target="_blank"
        >
          Nav
        </a>
      </div>
      <div class="text">
        <a
          href="https://github.com/xjh22222228/beautiful-window"
          target="_blank"
        >
          Beautiful window
        </a>
      </div>
    </div>
  </div>
</div>
<!-- UI Style -->
<style>
.foot-template1 {
  margin-top: 2rem;
  padding: 2rem 1rem 0 1rem;
  text-align: left;
  background-color: #fff;
  border-top: 1px solid #e2e2e2;
}
.foot-template1 .template1 {
  max-width: 1150px;
  margin: 0 auto;
}
.foot-template1 .title {
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 2rem;
}
.foot-template1 .text {
  font-size: 0.9rem;
  margin-bottom: 2rem;
  color: rgba(18, 20, 28, 0.7);
}
</style>  
`,

  footTemplate2: `
<div>共收录$\{total}个网站</div>
<div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
`,
}

export default t
