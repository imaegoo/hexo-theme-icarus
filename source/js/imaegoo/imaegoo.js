(function ($) {
  /**
   * 等背景图片加载完成后再显示
   * https://www.imaegoo.com/
   var dongmanImg = new Image();
   if (document.body.offsetWidth > 768) {
     dongmanImg.src = 'https://api.btstu.cn/sjbz/?lx=dongman&format=images&method=pc';
   } else {
     dongmanImg.src = 'https://api.btstu.cn/sjbz/?lx=dongman&format=images&method=mobile';
   }
   var dongmanInterval = setInterval(function () {
     if (dongmanImg.complete) {
       document.body.classList.add('ready');
       clearInterval(dongmanInterval);
     }
   }, 100);
   */

  /**
   * 仿 CSDN 左侧栏吸底效果，设置 position 为 sticky，top 为屏幕高度减去左侧栏高度，比 CSDN 的实现更简洁。
   * https://www.imaegoo.com/
   */
  var columnLeft = $('.column-left')[0];

  function fixLeftColumnTop() {
    // if SBP return
    if ($(window).width() < 769) {
      columnLeft.style.top = null;
    } else {
      if (columnLeft) {
        columnLeft.style.top = $(window).height() - columnLeft.scrollHeight - 10 + 'px';
      } else {
        setTimeout(function () {
          columnLeft = $('.column-left')[0];
          fixLeftColumnTop();
        }, 500);
      }
    }
  }
  fixLeftColumnTop();
  $(window).resize(fixLeftColumnTop);

  function loadTwikooNewComment() {
    var twikooNewEl = document.getElementsByClassName('twikoo-new-container');
    if (twikooNewEl.length === 0) return;
    twikoo.getRecentComments({
      envId: window.twikooEnvId,
      pageSize: 5,
      includeReply: true
    }).then(function (res) {
      var innerHTML = '';
      for (var idx1 = 0; idx1 < res.length; idx1++) {
        var item = res[idx1];
        if (!item.commentText.trim()) continue
        innerHTML += '<article class="media"><div class="media-content">'
          + '<p class="title twikoo-new-content"><a href="' + item.url + '#' + item.id + '">' + changeContent(item.commentText) + '</a></p>'
          + '<p class="date">' + item.nick + ' / ' + item.relativeTime + '</p>'
          + '</div></article>';
      }
      for (var idx2 = 0; idx2 < twikooNewEl.length; idx2++) {
        twikooNewEl[idx2].innerHTML = innerHTML;
      }
    }).catch(function (err) {
      console.error(err);
      twikooNewEl.innerHTML = '加载失败';
    });
  }

  // 从 butterfly 主题借鉴
  // https://github.com/jerryc127/hexo-theme-butterfly/blob/dev/layout/includes/third-party/newest-comments/twikoo-comment.pug
  function changeContent (content) {
    if (content === '') return content;
    content = content.replace(/<[^>]+>/g, ''); // remove html tag
    if (content.length > 150) {
      content = content.substring(0, 150) + '...';
    }
    return content;
  }

  loadTwikooNewComment();

  // 即将访问虹墨空间站外部的第三方网址
  function onThirdPartyLinkClick (e) {
    e.preventDefault();
    var href = e.currentTarget.getAttribute('href');
    var maskEl = document.createElement('div');
    maskEl.style.position = 'fixed';
    maskEl.style.inset = '0';
    maskEl.style.zIndex = '9000';
    maskEl.style.background = 'rgba(0,0,0,.6)';
    var dialogEl = document.createElement('div');
    dialogEl.style.position = 'absolute';
    dialogEl.style.top = '50%';
    dialogEl.style.left = '50%';
    dialogEl.style.transform = 'translate(-50%,-50%)';
    dialogEl.style.width = '300px';
    dialogEl.style.background = '#fff';
    dialogEl.style.borderRadius = '10px';
    dialogEl.style.padding = '20px 20px 16px';
    dialogEl.style.overflowWrap = 'anywhere';
    var descEl = document.createElement('div');
    descEl.innerText = '即将访问虹墨空间站外部的第三方网址: ' + href;
    var btnGroupEl = document.createElement('div');
    btnGroupEl.style.marginTop = '10px';
    btnGroupEl.style.textAlign = 'right';
    var btnCancelEl = document.createElement('button');
    btnCancelEl.innerText = '取消';
    btnCancelEl.classList.add('button');
    btnCancelEl.addEventListener('click', function () {
      document.body.removeChild(maskEl);
    });
    var btnConfirmEl = document.createElement('button');
    btnConfirmEl.innerText = '允许';
    btnConfirmEl.classList.add('button', 'is-success');
    btnConfirmEl.style.marginLeft = '10px';
    btnConfirmEl.addEventListener('click', function () {
      document.body.removeChild(maskEl);
      window.open(href, '_blank');
    });
    btnGroupEl.appendChild(btnCancelEl);
    btnGroupEl.appendChild(btnConfirmEl);
    dialogEl.appendChild(descEl);
    dialogEl.appendChild(btnGroupEl);
    maskEl.appendChild(dialogEl);
    document.body.appendChild(maskEl);
  }

  window.handleThirdPartyLink = function (scope) {
    var links = scope.querySelectorAll('a');
    for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
      var link = links[linkIndex];
      var href = link.getAttribute('href');
      if (href && href.startsWith('http') && !href.startsWith('https://www.imaegoo.com')) {
        link.removeEventListener('click', onThirdPartyLinkClick); 
        link.addEventListener('click', onThirdPartyLinkClick);
      }
    }
  }

  handleThirdPartyLink(document.body);
}(jQuery));
