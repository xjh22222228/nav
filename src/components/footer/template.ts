const t: Record<string, any> = {
  footTemplate1: `
<div class="bg-white py-8 px-8 mx-auto text-left dark-bg dark-border-color">
  <div
    style="width: 1050px"
    class="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div>
      <div class="dark-white text-base font-bold mb-8">联系方式</div>
      <div class="text-gray-600 dark-white-700 mb-6">
        问题反馈：xjh22222228&commat;gmail.com
      </div>
      <div class="text-gray-600 dark-white-700 mb-6">
        微信授权：xjh22222228
      </div>
    </div>

    <div>
      <div class="dark-white text-base font-bold mb-8">网站信息</div>
      <div class="text-gray-600 dark-white-700 mb-6">共收录 $\{total} 个网站</div>
      <div class="mb-6">
        <a class="applyweb"> 申请收录 </a>
      </div>
    </div>

    <div>
      <div class="dark-white text-base font-bold mb-8">技术支持</div>
      <div class="mb-6">
        <a href="https://github.com/xjh22222228/nav" target="_blank">
          Nav
        </a>
      </div>
      <div class="mb-6">
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
`,

  footTemplate2: `
<div>共收录$\{total}个网站</div>
<div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
`,
}

export default t
