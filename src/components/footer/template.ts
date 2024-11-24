const t: Record<string, any> = {
  footTemplate1: `
<div class="bg-white py-8 px-4 mx-auto text-left dark-bg dark-border-color">
  <div
    style="width: 1080px"
    class="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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

    <div class="text-center w-32 max-full">
      <div>
        <img src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/202.jpg" class="w-full" />
      </div>
    </div>
  </div>
</div>
`,

  footTemplate2: `
<div class="dark-white">
  <div>共收录$\{total}个网站</div>
  <div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
</div>
`,

  footTemplate3: `
<div
  class="text-gray-600 dark-white px-3.5 max-w-full flex-wrap text-xs py-1 flex items-center justify-center flex-col-reverse md:flex-row"
>
  <div class="mt-2 md:mt-0 flex justify-center items-center mr-4">
    <img
      class="w-6 h-6 mr-2"
      src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg"
    />
    &commat; $\{year} $\{hostname}, $\{total}.
  </div>

  <div
    class="flex break-all justify-center flex-wrap items-center gap-x-4 gap-y-1"
  >
    <a
      href="https://github.com/xjh22222228"
      target="_blank"
      class="text-gray-600 hover:underline"
      >Author</a
    >
    <a
      href="https://github.com/xjh22222228/nav"
      target="_blank"
      class="text-gray-600 hover:underline"
      >Nav</a
    >
    <a
      href="https://github.com/xjh22222228/boomb"
      target="_blank"
      class="text-gray-600 hover:underline"
      >Boomb</a
    >
    <a
      href="https://github.com/xjh22222228/beautiful-window"
      target="_blank"
      class="text-gray-600 hover:underline"
      >Beautiful window</a
    >
    <a
      href="https://github.com/xjh22222228/tomato-work"
      target="_blank"
      class="text-gray-600 hover:underline"
      >Tomato work</a
    >
  </div>
</div>
  `,
}

export default t
