/**
 * Twikoo comment JSX component.
 * @module view/comment/twikoo
 */
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Twikoo comment JSX component.
 *
 * @see https://twikoo.js.org/quick-start.html
 * @example
 * <Twikoo
 *     envId="env_id"
 *     region="ap-guangzhou"
 *     lang="zh-CN"
 *     jsUrl="/path/to/Twikoo.js" />
 */
class Twikoo extends Component {
  render() {
    const { envId, region, lang, jsUrl } = this.props;
    const js = `twikoo.init({
            envId: '${envId}',
            ${region ? `region: ${JSON.stringify(region)},` : ''}
            ${lang ? `lang: ${JSON.stringify(lang)},` : ''}
            onCommentLoaded: function () {
              var commentContents = document.getElementsByClassName('tk-content');
              for (var i = 0; i < commentContents.length; i++) {
                var commentItem = commentContents[i];
                var imgEls = commentItem.getElementsByTagName('img');
                if (imgEls.length > 0) {
                  for (var j = 0; j < imgEls.length; j++) {
                    var imgEl = imgEls[j];
                    var aEl = document.createElement('a');
                    aEl.setAttribute('class', 'tk-lg-link');
                    aEl.setAttribute('href', imgEl.getAttribute('src'));
                    aEl.setAttribute('data-src', imgEl.getAttribute('src'));
                    aEl.appendChild(imgEl.cloneNode(false));
                    imgEl.parentNode.insertBefore(aEl, imgEl.nextSibling);
                    imgEl.remove();
                  }
                  if (typeof $.fn.lightGallery === 'function') {
                    $(commentItem).lightGallery({
                      selector: '.tk-lg-link'
                    });
                  }
                }
                handleThirdPartyLink && handleThirdPartyLink(commentItem);
              }
            }
        });`;
    return (
      <Fragment>
        <div id="twikoo" class="content twikoo"></div>
        <script src={jsUrl}></script>
        <script dangerouslySetInnerHTML={{ __html: js }}></script>
      </Fragment>
    );
  }
}

/**
 * Cacheable Twikoo comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Twikoo.Cacheable
 *     comment={{
 *         env_id: "env_id",
 *         region: "ap-guangzhou",
 *         lang: "zh-CN",
 *     }} />
 */
Twikoo.Cacheable = cacheComponent(Twikoo, 'comment.twikoo', (props) => {
  const { comment, helper, page, config } = props;

  return {
    envId: comment.env_id,
    region: comment.region,
    lang: comment.lang || page.lang || page.language || config.language || 'zh-CN',
    jsUrl: comment.js_url || helper.cdn('twikoo', '1.6.30', 'dist/twikoo.all.min.js'),
  };
});

module.exports = Twikoo;
