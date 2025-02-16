(async () => {
  (function polyfill() {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) {
      return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
      processPreload(link);
    }
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
        }
      }
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function getFetchOpts(link) {
      const fetchOpts = {};
      if (link.integrity) fetchOpts.integrity = link.integrity;
      if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
      if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
      else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
      else fetchOpts.credentials = "same-origin";
      return fetchOpts;
    }
    function processPreload(link) {
      if (link.ep) return;
      link.ep = true;
      const fetchOpts = getFetchOpts(link);
      fetch(link.href, fetchOpts);
    }
  })();
  var n, l$3, u$3, t$2, i$2, o$2, r$1, f$3, e$2, c$2, s$3, a$2, h$1 = {}, v$2 = [], p$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y$2 = Array.isArray;
  function d$3(n2, l2) {
    for (var u2 in l2) n2[u2] = l2[u2];
    return n2;
  }
  function w$2(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _$2(l2, u2, t2) {
    var i2, o2, r2, f2 = {};
    for (r2 in u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (r2 in l2.defaultProps) void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
    return g$1(l2, f2, i2, o2, null);
  }
  function g$1(n2, t2, i2, o2, r2) {
    var f2 = {
      type: n2,
      props: t2,
      key: i2,
      ref: o2,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: null == r2 ? ++u$3 : r2,
      __i: -1,
      __u: 0
    };
    return null == r2 && null != l$3.vnode && l$3.vnode(f2), f2;
  }
  function b$1(n2) {
    return n2.children;
  }
  function k$1(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function x$1(n2, l2) {
    if (null == l2) return n2.__ ? x$1(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
    return "function" == typeof n2.type ? x$1(n2) : null;
  }
  function C$1(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
      return C$1(n2);
    }
  }
  function S(n2) {
    (!n2.__d && (n2.__d = true) && i$2.push(n2) && !M.__r++ || o$2 !== l$3.debounceRendering) && ((o$2 = l$3.debounceRendering) || r$1)(M);
  }
  function M() {
    var n2, u2, t2, o2, r2, e2, c2, s2;
    for (i$2.sort(f$3); n2 = i$2.shift(); ) n2.__d && (u2 = i$2.length, o2 = void 0, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d$3({}, r2)).__v = r2.__v + 1, l$3.vnode && l$3.vnode(o2), O(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [
      e2
    ] : null, c2, null == e2 ? x$1(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j$1(c2, o2, s2), o2.__e != e2 && C$1(o2)), i$2.length > u2 && i$2.sort(f$3));
    M.__r = 0;
  }
  function P(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, p2, y2, d2, w2, _2 = t2 && t2.__k || v$2, g2 = l2.length;
    for (u2.__d = e2, $(u2, l2, _2), e2 = u2.__d, a2 = 0; a2 < g2; a2++) null != (y2 = u2.__k[a2]) && (p2 = -1 === y2.__i ? h$1 : _2[y2.__i] || h$1, y2.__i = a2, O(n2, y2, p2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && p2.ref != y2.ref && (p2.ref && N(p2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), 65536 & y2.__u || p2.__k === y2.__k ? e2 = I(y2, e2, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
    u2.__d = e2, u2.__e = w2;
  }
  function $(n2, l2, u2) {
    var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
    for (n2.__k = [], t2 = 0; t2 < e2; t2++) null != (i2 = l2[t2]) && "boolean" != typeof i2 && "function" != typeof i2 ? (r2 = t2 + a2, (i2 = n2.__k[t2] = "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$1(null, i2, null, null, null) : y$2(i2) ? g$1(b$1, {
      children: i2
    }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? g$1(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2).__ = n2, i2.__b = n2.__b + 1, o2 = null, -1 !== (f2 = i2.__i = L(i2, u2, r2, s2)) && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2-- : f2 == r2 + 1 ? a2++ : (f2 > r2 ? a2-- : a2++, i2.__u |= 65536))) : i2 = n2.__k[t2] = null;
    if (s2) for (t2 = 0; t2 < c2; t2++) null != (o2 = u2[t2]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x$1(o2)), V(o2, o2));
  }
  function I(n2, l2, u2) {
    var t2, i2;
    if ("function" == typeof n2.type) {
      for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = I(t2[i2], l2, u2));
      return l2;
    }
    n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x$1(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 === l2.nodeType);
    return l2;
  }
  function L(n2, l2, u2, t2) {
    var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
    if (null === e2 || e2 && i2 == e2.key && o2 === e2.type && 0 == (131072 & e2.__u)) return u2;
    if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0)) for (; r2 >= 0 || f2 < l2.length; ) {
      if (r2 >= 0) {
        if ((e2 = l2[r2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return r2;
        r2--;
      }
      if (f2 < l2.length) {
        if ((e2 = l2[f2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return f2;
        f2++;
      }
    }
    return -1;
  }
  function T$1(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || p$2.test(l2) ? u2 : u2 + "px";
  }
  function A$1(n2, l2, u2, t2, i2) {
    var o2;
    n: if ("style" === l2) if ("string" == typeof u2) n2.style.cssText = u2;
    else {
      if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$1(n2.style, l2, "");
      if (u2) for (l2 in u2) t2 && u2[l2] === t2[l2] || T$1(n2.style, l2, u2[l2]);
    }
    else if ("o" === l2[0] && "n" === l2[1]) o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || "onFocusOut" === l2 || "onFocusIn" === l2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e$2, n2.addEventListener(l2, o2 ? s$3 : c$2, o2)) : n2.removeEventListener(l2, o2 ? s$3 : c$2, o2);
    else {
      if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
        n2[l2] = null == u2 ? "" : u2;
        break n;
      } catch (n3) {
      }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
    }
  }
  function F(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2.t) u2.t = e$2++;
        else if (u2.t < t2.u) return;
        return t2(l$3.event ? l$3.event(u2) : u2);
      }
    };
  }
  function O(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, h2, v2, p2, w2, _2, g2, m2, x2, C2, S2, M2, $2, I2, H, L2, T2 = u2.type;
    if (void 0 !== u2.constructor) return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [
      e2 = u2.__e = t2.__e
    ]), (a2 = l$3.__b) && a2(u2);
    n: if ("function" == typeof T2) try {
      if (m2 = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], S2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m2, S2) : (u2.__c = h2 = new k$1(m2, S2), h2.constructor = T2, h2.render = q), C2 && C2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = S2, h2.__n = i2, v2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$3({}, h2.__s)), d$3(h2.__s, T2.getDerivedStateFromProps(m2, h2.__s))), p2 = h2.props, w2 = h2.state, h2.__v = u2, v2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
      else {
        if (x2 && null == T2.getDerivedStateFromProps && m2 !== p2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, S2), !h2.__e && (null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(m2, h2.__s, S2) || u2.__v === t2.__v)) {
          for (u2.__v !== t2.__v && (h2.props = m2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
            n3 && (n3.__ = u2);
          }), M2 = 0; M2 < h2._sb.length; M2++) h2.__h.push(h2._sb[M2]);
          h2._sb = [], h2.__h.length && f2.push(h2);
          break n;
        }
        null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, S2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
          h2.componentDidUpdate(p2, w2, _2);
        });
      }
      if (h2.context = S2, h2.props = m2, h2.__P = n2, h2.__e = false, $2 = l$3.__r, I2 = 0, x2) {
        for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H = 0; H < h2._sb.length; H++) h2.__h.push(h2._sb[H]);
        h2._sb = [];
      } else do {
        h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
      } while (h2.__d && ++I2 < 25);
      h2.state = h2.__s, null != h2.getChildContext && (i2 = d$3(d$3({}, i2), h2.getChildContext())), x2 && !v2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(p2, w2)), P(n2, y$2(L2 = null != a2 && a2.type === b$1 && null == a2.key ? a2.props.children : a2) ? L2 : [
        L2
      ], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
    } catch (n3) {
      if (u2.__v = null, c2 || null != r2) {
        for (u2.__u |= c2 ? 160 : 128; e2 && 8 === e2.nodeType && e2.nextSibling; ) e2 = e2.nextSibling;
        r2[r2.indexOf(e2)] = null, u2.__e = e2;
      } else u2.__e = t2.__e, u2.__k = t2.__k;
      l$3.__e(n3, u2, t2);
    }
    else null == r2 && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z$1(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
    (a2 = l$3.diffed) && a2(u2);
  }
  function j$1(n2, u2, t2) {
    u2.__d = void 0;
    for (var i2 = 0; i2 < t2.length; i2++) N(t2[i2], t2[++i2], t2[++i2]);
    l$3.__c && l$3.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$3.__e(n3, u3.__v);
      }
    });
  }
  function z$1(u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, v2, p2, d2, _2, g2, m2, b2 = i2.props, k2 = t2.props, C2 = t2.type;
    if ("svg" === C2 ? r2 = "http://www.w3.org/2000/svg" : "math" === C2 ? r2 = "http://www.w3.org/1998/Math/MathML" : r2 || (r2 = "http://www.w3.org/1999/xhtml"), null != f2) {
      for (a2 = 0; a2 < f2.length; a2++) if ((_2 = f2[a2]) && "setAttribute" in _2 == !!C2 && (C2 ? _2.localName === C2 : 3 === _2.nodeType)) {
        u2 = _2, f2[a2] = null;
        break;
      }
    }
    if (null == u2) {
      if (null === C2) return document.createTextNode(k2);
      u2 = document.createElementNS(r2, C2, k2.is && k2), c2 && (l$3.__m && l$3.__m(t2, f2), c2 = false), f2 = null;
    }
    if (null === C2) b2 === k2 || c2 && u2.data === k2 || (u2.data = k2);
    else {
      if (f2 = f2 && n.call(u2.childNodes), b2 = i2.props || h$1, !c2 && null != f2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(_2 = u2.attributes[a2]).name] = _2.value;
      for (a2 in b2) if (_2 = b2[a2], "children" == a2) ;
      else if ("dangerouslySetInnerHTML" == a2) p2 = _2;
      else if (!(a2 in k2)) {
        if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
        A$1(u2, a2, null, _2, r2);
      }
      for (a2 in k2) _2 = k2[a2], "children" == a2 ? d2 = _2 : "dangerouslySetInnerHTML" == a2 ? v2 = _2 : "value" == a2 ? g2 = _2 : "checked" == a2 ? m2 = _2 : c2 && "function" != typeof _2 || b2[a2] === _2 || A$1(u2, a2, _2, b2[a2], r2);
      if (v2) c2 || p2 && (v2.__html === p2.__html || v2.__html === u2.innerHTML) || (u2.innerHTML = v2.__html), t2.__k = [];
      else if (p2 && (u2.innerHTML = ""), P(u2, y$2(d2) ? d2 : [
        d2
      ], t2, i2, o2, "foreignObject" === C2 ? "http://www.w3.org/1999/xhtml" : r2, f2, e2, f2 ? f2[0] : i2.__k && x$1(i2, 0), c2, s2), null != f2) for (a2 = f2.length; a2--; ) w$2(f2[a2]);
      c2 || (a2 = "value", "progress" === C2 && null == g2 ? u2.removeAttribute("value") : void 0 !== g2 && (g2 !== u2[a2] || "progress" === C2 && !g2 || "option" === C2 && g2 !== b2[a2]) && A$1(u2, a2, g2, b2[a2], r2), a2 = "checked", void 0 !== m2 && m2 !== u2[a2] && A$1(u2, a2, m2, b2[a2], r2));
    }
    return u2;
  }
  function N(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else n2.current = u2;
    } catch (n3) {
      l$3.__e(n3, t2);
    }
  }
  function V(n2, u2, t2) {
    var i2, o2;
    if (l$3.unmount && l$3.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (n3) {
        l$3.__e(n3, u2);
      }
      i2.base = i2.__P = null;
    }
    if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && V(i2[o2], u2, t2 || "function" != typeof n2.type);
    t2 || w$2(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
  }
  function q(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function B$1(u2, t2, i2) {
    var o2, r2, f2, e2;
    l$3.__ && l$3.__(u2, t2), r2 = (o2 = "function" == typeof i2) ? null : t2.__k, f2 = [], e2 = [], O(t2, u2 = (!o2 && i2 || t2).__k = _$2(b$1, null, [
      u2
    ]), r2 || h$1, h$1, t2.namespaceURI, !o2 && i2 ? [
      i2
    ] : r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t2.firstChild, o2, e2), j$1(f2, u2, e2);
  }
  function G(n2, l2) {
    var u2 = {
      __c: l2 = "__cC" + a$2++,
      __: n2,
      Consumer: function(n3, l3) {
        return n3.children(l3);
      },
      Provider: function(n3) {
        var u3, t2;
        return this.getChildContext || (u3 = /* @__PURE__ */ new Set(), (t2 = {})[l2] = this, this.getChildContext = function() {
          return t2;
        }, this.componentWillUnmount = function() {
          u3 = null;
        }, this.shouldComponentUpdate = function(n4) {
          this.props.value !== n4.value && u3.forEach(function(n5) {
            n5.__e = true, S(n5);
          });
        }, this.sub = function(n4) {
          u3.add(n4);
          var l3 = n4.componentWillUnmount;
          n4.componentWillUnmount = function() {
            u3 && u3.delete(n4), l3 && l3.call(n4);
          };
        }), n3.children;
      }
    };
    return u2.Provider.__ = u2.Consumer.contextType = u2;
  }
  n = v$2.slice, l$3 = {
    __e: function(n2, l2, u2, t2) {
      for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
        if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
      throw n2;
    }
  }, u$3 = 0, t$2 = function(n2) {
    return null != n2 && null == n2.constructor;
  }, k$1.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d$3({}, this.state), "function" == typeof n2 && (n2 = n2(d$3({}, u2), this.props)), n2 && d$3(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), S(this));
  }, k$1.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), S(this));
  }, k$1.prototype.render = b$1, i$2 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$3 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, M.__r = 0, e$2 = 0, c$2 = F(false), s$3 = F(true), a$2 = 0;
  var f$2 = 0;
  function u$2(e2, t2, n2, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, l2 = t2;
    "ref" in t2 && (a2 = t2.ref, delete t2.ref);
    var p2 = {
      type: e2,
      props: l2,
      key: n2,
      ref: a2,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: --f$2,
      __i: -1,
      __u: 0,
      __source: i2,
      __self: u2
    };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === l2[c2] && (l2[c2] = a2[c2]);
    return l$3.vnode && l$3.vnode(p2), p2;
  }
  const __vite__wasmUrl = "" + new URL("rem8x_bg-DpbOrDSH.wasm", import.meta.url).href;
  const __vite__initWasm = async (opts = {}, url) => {
    let result;
    if (url.startsWith("data:")) {
      const urlContent = url.replace(/^data:.*?base64,/, "");
      let bytes;
      if (typeof Buffer === "function" && typeof Buffer.from === "function") {
        bytes = Buffer.from(urlContent, "base64");
      } else if (typeof atob === "function") {
        const binaryString = atob(urlContent);
        bytes = new Uint8Array(binaryString.length);
        for (let i2 = 0; i2 < binaryString.length; i2++) {
          bytes[i2] = binaryString.charCodeAt(i2);
        }
      } else {
        throw new Error("Cannot decode base64-encoded data URL");
      }
      result = await WebAssembly.instantiate(bytes, opts);
    } else {
      const response = await fetch(url);
      const contentType = response.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
        result = await WebAssembly.instantiateStreaming(response, opts);
      } else {
        const buffer = await response.arrayBuffer();
        result = await WebAssembly.instantiate(buffer, opts);
      }
    }
    return result.instance.exports;
  };
  let wasm$1;
  function __wbg_set_wasm(val) {
    wasm$1 = val;
  }
  const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
  let cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  cachedTextDecoder.decode();
  let cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm$1.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }
  function addToExternrefTable0(obj) {
    const idx = wasm$1.__externref_table_alloc();
    wasm$1.__wbindgen_export_3.set(idx, obj);
    return idx;
  }
  function handleError(f2, args) {
    try {
      return f2.apply(this, args);
    } catch (e2) {
      const idx = addToExternrefTable0(e2);
      wasm$1.__wbindgen_exn_store(idx);
    }
  }
  let WASM_VECTOR_LEN = 0;
  const lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
  let cachedTextEncoder = new lTextEncoder("utf-8");
  const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  } : function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length, 1) >>> 0;
      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  let cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function init$1() {
    wasm$1.init();
  }
  function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
  }
  function song_name$1(song) {
    let deferred1_0;
    let deferred1_1;
    try {
      _assertClass(song, WasmSong);
      const ret = wasm$1.song_name(song.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  function song_version$1(song) {
    let deferred1_0;
    let deferred1_1;
    try {
      _assertClass(song, WasmSong);
      const ret = wasm$1.song_version(song.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  function takeFromExternrefTable0(idx) {
    const value = wasm$1.__wbindgen_export_3.get(idx);
    wasm$1.__externref_table_dealloc(idx);
    return value;
  }
  function write_song$1(song, current_song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.write_song(song.__wbg_ptr, current_song);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function load_song$1(arr) {
    const ret = wasm$1.load_song(arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return WasmSong.__wrap(ret[0]);
  }
  function pick_song_step$1(song, x2, y2) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.pick_song_step(song.__wbg_ptr, x2, y2);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  function set_song_step$1(song, x2, y2, value) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.set_song_step(song.__wbg_ptr, x2, y2, value);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function get_song_steps$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.get_song_steps(song.__wbg_ptr);
    return ret;
  }
  function get_chain_steps$1(song, chain_index) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.get_chain_steps(song.__wbg_ptr, chain_index);
    return ret;
  }
  function show_phrase$1(song, phrase) {
    let deferred1_0;
    let deferred1_1;
    try {
      _assertClass(song, WasmSong);
      const ret = wasm$1.show_phrase(song.__wbg_ptr, phrase);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  function show_table$1(song, table) {
    let deferred1_0;
    let deferred1_1;
    try {
      _assertClass(song, WasmSong);
      const ret = wasm$1.show_table(song.__wbg_ptr, table);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  function rename_instrument$1(song, instrument, new_name) {
    _assertClass(song, WasmSong);
    const ptr0 = passStringToWasm0(new_name, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm$1.rename_instrument(song.__wbg_ptr, instrument, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function renumber_table$1(song, table, to_table) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.renumber_table(song.__wbg_ptr, table, to_table);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function renumber_eq$1(song, eq, to_eq) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.renumber_eq(song.__wbg_ptr, eq, to_eq);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function renumber_instrument$1(song, instrument, to_instrument) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.renumber_instrument(song.__wbg_ptr, instrument, to_instrument);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function renumber_chain$1(song, chain, to_chain) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.renumber_chain(song.__wbg_ptr, chain, to_chain);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function renumber_phrase$1(song, phrase, to_phrase) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.renumber_phrase(song.__wbg_ptr, phrase, to_phrase);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function dump_chain$1(from, chain) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.dump_chain(from.__wbg_ptr, chain);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function blast_chain$1(from, chain, arr) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.blast_chain(from.__wbg_ptr, chain, arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function remap_chain$1(from, to, chain) {
    _assertClass(from, WasmSong);
    _assertClass(to, WasmSong);
    const ret = wasm$1.remap_chain(from.__wbg_ptr, to.__wbg_ptr, chain);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] >>> 0;
  }
  function describe_mapping$1(remapper) {
    const ret = wasm$1.describe_mapping(remapper);
    return ret;
  }
  function remap_chain_apply$1(from, to, raw_mapping, chain, x2, y2) {
    _assertClass(from, WasmSong);
    _assertClass(to, WasmSong);
    const ret = wasm$1.remap_chain_apply(from.__wbg_ptr, to.__wbg_ptr, raw_mapping, chain, x2, y2);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  function copy_instrument$1(from, to, instrument, to_instrument) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_instrument(from.__wbg_ptr, to.__wbg_ptr, instrument, to_instrument);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  function dump_instrument$1(from, instrument) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.dump_instrument(from.__wbg_ptr, instrument);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function blast_instrument$1(from, instrument, arr) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.blast_instrument(from.__wbg_ptr, instrument, arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function dump_phrase$1(from, phrase) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.dump_phrase(from.__wbg_ptr, phrase);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function blast_phrase$1(from, phrase, arr) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.blast_phrase(from.__wbg_ptr, phrase, arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function copy_phrase$1(from, to, phrase, to_phrase) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_phrase(from.__wbg_ptr, to.__wbg_ptr, phrase, to_phrase);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  function copy_eq$1(from, to, eq, to_eq) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_eq(from.__wbg_ptr, to.__wbg_ptr, eq, to_eq);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  function copy_chain_raw$1(from, to, chain, to_chain) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_chain_raw(from.__wbg_ptr, to.__wbg_ptr, chain, to_chain);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  function dump_eq$1(from, eq) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.dump_eq(from.__wbg_ptr, eq);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function blast_eq$1(from, eq, arr) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.blast_eq(from.__wbg_ptr, eq, arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function dump_table$1(from, table) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.dump_table(from.__wbg_ptr, table);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function blast_table$1(from, table, arr) {
    _assertClass(from, WasmSong);
    const ret = wasm$1.blast_table(from.__wbg_ptr, table, arr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  function copy_table$1(from, to, table, to_table) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_table(from.__wbg_ptr, to.__wbg_ptr, table, to_table);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  function instrument_name$1(song, instr) {
    let deferred1_0;
    let deferred1_1;
    try {
      _assertClass(song, WasmSong);
      const ret = wasm$1.instrument_name(song.__wbg_ptr, instr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  let cachedUint32ArrayMemory0 = null;
  function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
      cachedUint32ArrayMemory0 = new Uint32Array(wasm$1.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
  }
  function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  function allocated_instrument_list$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.allocated_instrument_list(song.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  function allocated_eq_list$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.allocated_eq_list(song.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  function allocated_phrase_list$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.allocated_phrase_list(song.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  function allocated_chain_list$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.allocated_chain_list(song.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  function allocated_table$1(song) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.allocated_table(song.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm$1.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  function describe_instrument$1(song, instrument) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.describe_instrument(song.__wbg_ptr, instrument);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function describe_succint_instrument$1(song, instrument) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.describe_succint_instrument(song.__wbg_ptr, instrument);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function describe_eq$1(song, eq_idx) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.describe_eq(song.__wbg_ptr, eq_idx);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  function eq_frequencies$1() {
    const ret = wasm$1.eq_frequencies();
    return ret;
  }
  function plot_eq$1(song, eq_idx, mode) {
    _assertClass(song, WasmSong);
    const ret = wasm$1.plot_eq(song.__wbg_ptr, eq_idx, mode);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  const WasmSongFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_wasmsong_free(ptr >>> 0, 1));
  class WasmSong {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(WasmSong.prototype);
      obj.__wbg_ptr = ptr;
      WasmSongFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      WasmSongFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_wasmsong_free(ptr, 0);
    }
  }
  function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = arg0.buffer;
    return ret;
  }
  function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
      deferred0_0 = arg0;
      deferred0_1 = arg1;
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm$1.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
  }
  function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = arg0.length;
    return ret;
  }
  function __wbg_log_822dd57fc941aa50(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
  }
  function __wbg_new_405e22f390576ce2() {
    const ret = new Object();
    return ret;
  }
  function __wbg_new_78c8a92080461d08(arg0) {
    const ret = new Float64Array(arg0);
    return ret;
  }
  function __wbg_new_78feb108b6472713() {
    const ret = new Array();
    return ret;
  }
  function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
  }
  function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  }
  function __wbg_newwithbyteoffsetandlength_93c8e0c1a479fa1a(arg0, arg1, arg2) {
    const ret = new Float64Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  }
  function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  }
  function __wbg_newwithlength_a381634e90c276d4(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
  }
  function __wbg_push_737cfc8c1432c2c6(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
  }
  function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  }
  function __wbg_set_bb8cecf6a62b9f46() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = Reflect.set(arg0, arg1, arg2);
      return ret;
    }, arguments);
  }
  function __wbg_setindex_dcd71eabf405bde1(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
  }
  function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  }
  function __wbindgen_init_externref_table() {
    const table = wasm$1.__wbindgen_export_3;
    const offset = table.grow(4);
    table.set(0, void 0);
    table.set(offset + 0, void 0);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  }
  function __wbindgen_memory() {
    const ret = wasm$1.memory;
    return ret;
  }
  function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
  }
  function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  }
  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  }
  URL = globalThis.URL;
  const __vite__wasmModule = await __vite__initWasm({
    "./rem8x_bg.js": {
      __wbindgen_string_new,
      __wbindgen_number_new,
      __wbg_log_822dd57fc941aa50,
      __wbg_new_8a6f238a6ece86ea,
      __wbg_stack_0ed75d68575b0f3c,
      __wbg_error_7534b8e9a36f1ab4,
      __wbg_new_78feb108b6472713,
      __wbg_new_405e22f390576ce2,
      __wbg_push_737cfc8c1432c2c6,
      __wbg_buffer_609cc3eee51ed158,
      __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
      __wbg_new_a12002a7f91c75be,
      __wbg_set_65595bdd868b3009,
      __wbg_length_a446193dc22c12f8,
      __wbg_newwithbyteoffsetandlength_93c8e0c1a479fa1a,
      __wbg_new_78c8a92080461d08,
      __wbg_newwithlength_a381634e90c276d4,
      __wbg_setindex_dcd71eabf405bde1,
      __wbg_set_bb8cecf6a62b9f46,
      __wbindgen_throw,
      __wbindgen_memory,
      __wbindgen_init_externref_table
    }
  }, __vite__wasmUrl);
  const memory = __vite__wasmModule.memory;
  const init = __vite__wasmModule.init;
  const __wbg_wasmsong_free = __vite__wasmModule.__wbg_wasmsong_free;
  const song_name = __vite__wasmModule.song_name;
  const song_version = __vite__wasmModule.song_version;
  const write_song = __vite__wasmModule.write_song;
  const load_song = __vite__wasmModule.load_song;
  const pick_song_step = __vite__wasmModule.pick_song_step;
  const set_song_step = __vite__wasmModule.set_song_step;
  const get_song_steps = __vite__wasmModule.get_song_steps;
  const get_chain_steps = __vite__wasmModule.get_chain_steps;
  const show_phrase = __vite__wasmModule.show_phrase;
  const show_table = __vite__wasmModule.show_table;
  const rename_instrument = __vite__wasmModule.rename_instrument;
  const renumber_table = __vite__wasmModule.renumber_table;
  const renumber_eq = __vite__wasmModule.renumber_eq;
  const renumber_instrument = __vite__wasmModule.renumber_instrument;
  const renumber_chain = __vite__wasmModule.renumber_chain;
  const renumber_phrase = __vite__wasmModule.renumber_phrase;
  const dump_chain = __vite__wasmModule.dump_chain;
  const blast_chain = __vite__wasmModule.blast_chain;
  const remap_chain = __vite__wasmModule.remap_chain;
  const describe_mapping = __vite__wasmModule.describe_mapping;
  const remap_chain_apply = __vite__wasmModule.remap_chain_apply;
  const copy_instrument = __vite__wasmModule.copy_instrument;
  const dump_instrument = __vite__wasmModule.dump_instrument;
  const blast_instrument = __vite__wasmModule.blast_instrument;
  const dump_phrase = __vite__wasmModule.dump_phrase;
  const blast_phrase = __vite__wasmModule.blast_phrase;
  const copy_phrase = __vite__wasmModule.copy_phrase;
  const copy_eq = __vite__wasmModule.copy_eq;
  const copy_chain_raw = __vite__wasmModule.copy_chain_raw;
  const dump_eq = __vite__wasmModule.dump_eq;
  const blast_eq = __vite__wasmModule.blast_eq;
  const dump_table = __vite__wasmModule.dump_table;
  const blast_table = __vite__wasmModule.blast_table;
  const copy_table = __vite__wasmModule.copy_table;
  const instrument_name = __vite__wasmModule.instrument_name;
  const allocated_instrument_list = __vite__wasmModule.allocated_instrument_list;
  const allocated_eq_list = __vite__wasmModule.allocated_eq_list;
  const allocated_phrase_list = __vite__wasmModule.allocated_phrase_list;
  const allocated_chain_list = __vite__wasmModule.allocated_chain_list;
  const allocated_table = __vite__wasmModule.allocated_table;
  const describe_instrument = __vite__wasmModule.describe_instrument;
  const describe_succint_instrument = __vite__wasmModule.describe_succint_instrument;
  const describe_eq = __vite__wasmModule.describe_eq;
  const eq_frequencies = __vite__wasmModule.eq_frequencies;
  const plot_eq = __vite__wasmModule.plot_eq;
  const __wbindgen_free = __vite__wasmModule.__wbindgen_free;
  const __wbindgen_exn_store = __vite__wasmModule.__wbindgen_exn_store;
  const __externref_table_alloc = __vite__wasmModule.__externref_table_alloc;
  const __wbindgen_export_3 = __vite__wasmModule.__wbindgen_export_3;
  const __wbindgen_malloc = __vite__wasmModule.__wbindgen_malloc;
  const __wbindgen_realloc = __vite__wasmModule.__wbindgen_realloc;
  const __externref_table_dealloc = __vite__wasmModule.__externref_table_dealloc;
  const __wbindgen_start = __vite__wasmModule.__wbindgen_start;
  const wasm = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_table_alloc,
    __externref_table_dealloc,
    __wbg_wasmsong_free,
    __wbindgen_exn_store,
    __wbindgen_export_3,
    __wbindgen_free,
    __wbindgen_malloc,
    __wbindgen_realloc,
    __wbindgen_start,
    allocated_chain_list,
    allocated_eq_list,
    allocated_instrument_list,
    allocated_phrase_list,
    allocated_table,
    blast_chain,
    blast_eq,
    blast_instrument,
    blast_phrase,
    blast_table,
    copy_chain_raw,
    copy_eq,
    copy_instrument,
    copy_phrase,
    copy_table,
    describe_eq,
    describe_instrument,
    describe_mapping,
    describe_succint_instrument,
    dump_chain,
    dump_eq,
    dump_instrument,
    dump_phrase,
    dump_table,
    eq_frequencies,
    get_chain_steps,
    get_song_steps,
    init,
    instrument_name,
    load_song,
    memory,
    pick_song_step,
    plot_eq,
    remap_chain,
    remap_chain_apply,
    rename_instrument,
    renumber_chain,
    renumber_eq,
    renumber_instrument,
    renumber_phrase,
    renumber_table,
    set_song_step,
    show_phrase,
    show_table,
    song_name,
    song_version,
    write_song
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  __wbg_set_wasm(wasm);
  __wbindgen_start();
  var t$1, r, u$1, i$1, o$1 = 0, f$1 = [], c$1 = l$3, e$1 = c$1.__b, a$1 = c$1.__r, v$1 = c$1.diffed, l$2 = c$1.__c, m = c$1.unmount, s$2 = c$1.__;
  function d$2(n2, t2) {
    c$1.__h && c$1.__h(r, n2, o$1 || t2), o$1 = 0;
    var u2 = r.__H || (r.__H = {
      __: [],
      __h: []
    });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function y$1(n2, u2) {
    var i2 = d$2(t$1++, 3);
    !c$1.__s && C(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__H.__h.push(i2));
  }
  function A(n2) {
    return o$1 = 5, T(function() {
      return {
        current: n2
      };
    }, []);
  }
  function T(n2, r2) {
    var u2 = d$2(t$1++, 7);
    return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function x(n2) {
    var u2 = r.context[n2.__c], i2 = d$2(t$1++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
  }
  function j() {
    for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z), n2.__H.__h.forEach(B), n2.__H.__h = [];
    } catch (t2) {
      n2.__H.__h = [], c$1.__e(t2, n2.__v);
    }
  }
  c$1.__b = function(n2) {
    r = null, e$1 && e$1(n2);
  }, c$1.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$2 && s$2(n2, t2);
  }, c$1.__r = function(n2) {
    a$1 && a$1(n2), t$1 = 0;
    var i2 = (r = n2.__c).__H;
    i2 && (u$1 === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t$1 = 0)), u$1 = r;
  }, c$1.diffed = function(n2) {
    v$1 && v$1(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$1)(j)), t2.__H.__.forEach(function(n3) {
      n3.i && (n3.__H = n3.i), n3.i = void 0;
    })), u$1 = r = null;
  }, c$1.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c$1.__e(r2, n3.__v);
      }
    }), l$2 && l$2(n2, t2);
  }, c$1.unmount = function(n2) {
    m && m(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w$1(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 100);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function B(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function C(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  var i = Symbol.for("preact-signals");
  function t() {
    if (!(s$1 > 1)) {
      var i2, t2 = false;
      while (void 0 !== h) {
        var r2 = h;
        h = void 0;
        f++;
        while (void 0 !== r2) {
          var o2 = r2.o;
          r2.o = void 0;
          r2.f &= -3;
          if (!(8 & r2.f) && c(r2)) try {
            r2.c();
          } catch (r3) {
            if (!t2) {
              i2 = r3;
              t2 = true;
            }
          }
          r2 = o2;
        }
      }
      f = 0;
      s$1--;
      if (t2) throw i2;
    } else s$1--;
  }
  var o = void 0;
  var h = void 0, s$1 = 0, f = 0, v = 0;
  function e(i2) {
    if (void 0 !== o) {
      var t2 = i2.n;
      if (void 0 === t2 || t2.t !== o) {
        t2 = {
          i: 0,
          S: i2,
          p: o.s,
          n: void 0,
          t: o,
          e: void 0,
          x: void 0,
          r: t2
        };
        if (void 0 !== o.s) o.s.n = t2;
        o.s = t2;
        i2.n = t2;
        if (32 & o.f) i2.S(t2);
        return t2;
      } else if (-1 === t2.i) {
        t2.i = 0;
        if (void 0 !== t2.n) {
          t2.n.p = t2.p;
          if (void 0 !== t2.p) t2.p.n = t2.n;
          t2.p = o.s;
          t2.n = void 0;
          o.s.n = t2;
          o.s = t2;
        }
        return t2;
      }
    }
  }
  function u(i2) {
    this.v = i2;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
  }
  u.prototype.brand = i;
  u.prototype.h = function() {
    return true;
  };
  u.prototype.S = function(i2) {
    if (this.t !== i2 && void 0 === i2.e) {
      i2.x = this.t;
      if (void 0 !== this.t) this.t.e = i2;
      this.t = i2;
    }
  };
  u.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      var t2 = i2.e, r2 = i2.x;
      if (void 0 !== t2) {
        t2.x = r2;
        i2.e = void 0;
      }
      if (void 0 !== r2) {
        r2.e = t2;
        i2.x = void 0;
      }
      if (i2 === this.t) this.t = r2;
    }
  };
  u.prototype.subscribe = function(i2) {
    var t2 = this;
    return E(function() {
      var r2 = t2.value, n2 = o;
      o = void 0;
      try {
        i2(r2);
      } finally {
        o = n2;
      }
    });
  };
  u.prototype.valueOf = function() {
    return this.value;
  };
  u.prototype.toString = function() {
    return this.value + "";
  };
  u.prototype.toJSON = function() {
    return this.value;
  };
  u.prototype.peek = function() {
    var i2 = o;
    o = void 0;
    try {
      return this.value;
    } finally {
      o = i2;
    }
  };
  Object.defineProperty(u.prototype, "value", {
    get: function() {
      var i2 = e(this);
      if (void 0 !== i2) i2.i = this.i;
      return this.v;
    },
    set: function(i2) {
      if (i2 !== this.v) {
        if (f > 100) throw new Error("Cycle detected");
        this.v = i2;
        this.i++;
        v++;
        s$1++;
        try {
          for (var r2 = this.t; void 0 !== r2; r2 = r2.x) r2.t.N();
        } finally {
          t();
        }
      }
    }
  });
  function d$1(i2) {
    return new u(i2);
  }
  function c(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
    return false;
  }
  function a(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
      var r2 = t2.S.n;
      if (void 0 !== r2) t2.r = r2;
      t2.S.n = t2;
      t2.i = -1;
      if (void 0 === t2.n) {
        i2.s = t2;
        break;
      }
    }
  }
  function l$1(i2) {
    var t2 = i2.s, r2 = void 0;
    while (void 0 !== t2) {
      var o2 = t2.p;
      if (-1 === t2.i) {
        t2.S.U(t2);
        if (void 0 !== o2) o2.n = t2.n;
        if (void 0 !== t2.n) t2.n.p = o2;
      } else r2 = t2;
      t2.S.n = t2.r;
      if (void 0 !== t2.r) t2.r = void 0;
      t2 = o2;
    }
    i2.s = r2;
  }
  function y(i2) {
    u.call(this, void 0);
    this.x = i2;
    this.s = void 0;
    this.g = v - 1;
    this.f = 4;
  }
  (y.prototype = new u()).h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === v) return true;
    this.g = v;
    this.f |= 1;
    if (this.i > 0 && !c(this)) {
      this.f &= -2;
      return true;
    }
    var i2 = o;
    try {
      a(this);
      o = this;
      var t2 = this.x();
      if (16 & this.f || this.v !== t2 || 0 === this.i) {
        this.v = t2;
        this.f &= -17;
        this.i++;
      }
    } catch (i3) {
      this.v = i3;
      this.f |= 16;
      this.i++;
    }
    o = i2;
    l$1(this);
    this.f &= -2;
    return true;
  };
  y.prototype.S = function(i2) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
    }
    u.prototype.S.call(this, i2);
  };
  y.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      u.prototype.U.call(this, i2);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
      }
    }
  };
  y.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
    }
  };
  Object.defineProperty(y.prototype, "value", {
    get: function() {
      if (1 & this.f) throw new Error("Cycle detected");
      var i2 = e(this);
      this.h();
      if (void 0 !== i2) i2.i = this.i;
      if (16 & this.f) throw this.v;
      return this.v;
    }
  });
  function w(i2) {
    return new y(i2);
  }
  function _$1(i2) {
    var r2 = i2.u;
    i2.u = void 0;
    if ("function" == typeof r2) {
      s$1++;
      var n2 = o;
      o = void 0;
      try {
        r2();
      } catch (t2) {
        i2.f &= -2;
        i2.f |= 8;
        g(i2);
        throw t2;
      } finally {
        o = n2;
        t();
      }
    }
  }
  function g(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    i2.x = void 0;
    i2.s = void 0;
    _$1(i2);
  }
  function p$1(i2) {
    if (o !== this) throw new Error("Out-of-order effect");
    l$1(this);
    o = i2;
    this.f &= -2;
    if (8 & this.f) g(this);
    t();
  }
  function b(i2) {
    this.x = i2;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
  }
  b.prototype.c = function() {
    var i2 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t2 = this.x();
      if ("function" == typeof t2) this.u = t2;
    } finally {
      i2();
    }
  };
  b.prototype.S = function() {
    if (1 & this.f) throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _$1(this);
    a(this);
    s$1++;
    var i2 = o;
    o = this;
    return p$1.bind(this, i2);
  };
  b.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h;
      h = this;
    }
  };
  b.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) g(this);
  };
  function E(i2) {
    var t2 = new b(i2);
    try {
      t2.c();
    } catch (i3) {
      t2.d();
      throw i3;
    }
    return t2.d.bind(t2);
  }
  var s;
  function l(n2, i2) {
    l$3[n2] = i2.bind(null, l$3[n2] || function() {
    });
  }
  function d(n2) {
    if (s) s();
    s = n2 && n2.S();
  }
  function p(n2) {
    var r2 = this, f2 = n2.data, o2 = useSignal(f2);
    o2.value = f2;
    var e2 = T(function() {
      var n3 = r2.__v;
      while (n3 = n3.__) if (n3.__c) {
        n3.__c.__$f |= 4;
        break;
      }
      r2.__$u.c = function() {
        var n4;
        if (!t$2(e2.peek()) && 3 === (null == (n4 = r2.base) ? void 0 : n4.nodeType)) r2.base.data = e2.peek();
        else {
          r2.__$f |= 1;
          r2.setState({});
        }
      };
      return w(function() {
        var n4 = o2.value.value;
        return 0 === n4 ? 0 : true === n4 ? "" : n4 || "";
      });
    }, []);
    return e2.value;
  }
  p.displayName = "_st";
  Object.defineProperties(u.prototype, {
    constructor: {
      configurable: true,
      value: void 0
    },
    type: {
      configurable: true,
      value: p
    },
    props: {
      configurable: true,
      get: function() {
        return {
          data: this
        };
      }
    },
    __b: {
      configurable: true,
      value: 1
    }
  });
  l("__b", function(n2, r2) {
    if ("string" == typeof r2.type) {
      var i2, t2 = r2.props;
      for (var f2 in t2) if ("children" !== f2) {
        var o2 = t2[f2];
        if (o2 instanceof u) {
          if (!i2) r2.__np = i2 = {};
          i2[f2] = o2;
          t2[f2] = o2.peek();
        }
      }
    }
    n2(r2);
  });
  l("__r", function(n2, r2) {
    d();
    var i2, t2 = r2.__c;
    if (t2) {
      t2.__$f &= -2;
      if (void 0 === (i2 = t2.__$u)) t2.__$u = i2 = function(n3) {
        var r3;
        E(function() {
          r3 = this;
        });
        r3.c = function() {
          t2.__$f |= 1;
          t2.setState({});
        };
        return r3;
      }();
    }
    d(i2);
    n2(r2);
  });
  l("__e", function(n2, r2, i2, t2) {
    d();
    n2(r2, i2, t2);
  });
  l("diffed", function(n2, r2) {
    d();
    var i2;
    if ("string" == typeof r2.type && (i2 = r2.__e)) {
      var t2 = r2.__np, f2 = r2.props;
      if (t2) {
        var o2 = i2.U;
        if (o2) for (var e2 in o2) {
          var u2 = o2[e2];
          if (void 0 !== u2 && !(e2 in t2)) {
            u2.d();
            o2[e2] = void 0;
          }
        }
        else i2.U = o2 = {};
        for (var a2 in t2) {
          var c2 = o2[a2], s2 = t2[a2];
          if (void 0 === c2) {
            c2 = _(i2, a2, s2, f2);
            o2[a2] = c2;
          } else c2.o(s2, f2);
        }
      }
    }
    n2(r2);
  });
  function _(n2, r2, i2, t2) {
    var f2 = r2 in n2 && void 0 === n2.ownerSVGElement, o2 = d$1(i2);
    return {
      o: function(n3, r3) {
        o2.value = n3;
        t2 = r3;
      },
      d: E(function() {
        var i3 = o2.value.value;
        if (t2[r2] !== i3) {
          t2[r2] = i3;
          if (f2) n2[r2] = i3;
          else if (i3) n2.setAttribute(r2, i3);
          else n2.removeAttribute(r2);
        }
      })
    };
  }
  l("unmount", function(n2, r2) {
    if ("string" == typeof r2.type) {
      var i2 = r2.__e;
      if (i2) {
        var t2 = i2.U;
        if (t2) {
          i2.U = void 0;
          for (var f2 in t2) {
            var o2 = t2[f2];
            if (o2) o2.d();
          }
        }
      }
    } else {
      var e2 = r2.__c;
      if (e2) {
        var u2 = e2.__$u;
        if (u2) {
          e2.__$u = void 0;
          u2.d();
        }
      }
    }
    n2(r2);
  });
  l("__h", function(n2, r2, i2, t2) {
    if (t2 < 3 || 9 === t2) r2.__$f |= 2;
    n2(r2, i2, t2);
  });
  k$1.prototype.shouldComponentUpdate = function(n2, r2) {
    var i2 = this.__$u;
    if (!(i2 && void 0 !== i2.s || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
    for (var t2 in r2) return true;
    for (var f2 in n2) if ("__source" !== f2 && n2[f2] !== this.props[f2]) return true;
    for (var o2 in this.props) if (!(o2 in n2)) return true;
    return false;
  };
  function useSignal(n2) {
    return T(function() {
      return d$1(n2);
    }, []);
  }
  const EmptySelection = {
    start: {
      x: -1,
      y: -1
    },
    end: {
      x: -1,
      y: -1
    }
  };
  const EmptyNumberEdition = {
    base_value: -1,
    current_value: -1
  };
  const EmptyChainEdition = {
    x: -1,
    y: -1,
    base_value: -1,
    current_value: -1
  };
  const EmptyInstrumentNameEdition = {
    instrument_id: -1,
    name: ""
  };
  function initPane(side) {
    return {
      side,
      loaded_name: d$1(void 0),
      song: d$1(void 0),
      bumper: d$1(0),
      edited_chain: d$1(void 0),
      edited_phrase: d$1(void 0),
      edited_instrument: d$1(void 0),
      edited_instrument_name: d$1(void 0),
      edited_table: d$1(void 0),
      edited_eq: d$1(void 0),
      raw_song: d$1(new Uint8Array(0)),
      selected_eq: d$1(void 0),
      selected_chain: d$1(void 0),
      selected_phrase: d$1(void 0),
      selection_range: d$1(void 0),
      selected_table: d$1(void 0),
      selected_instrument: d$1(void 0),
      active_view: d$1("song")
    };
  }
  function clearPanel(panel) {
    panel.loaded_name.value = void 0;
    panel.song.value = void 0;
    panel.raw_song.value = void 0;
    panel.selected_chain.value = void 0;
    panel.selected_phrase.value = void 0;
    panel.selection_range.value = void 0;
  }
  function initState() {
    return {
      message_banner: d$1(void 0),
      undo_stack_pointer: d$1(0),
      left: initPane("left"),
      right: initPane("right"),
      remap_log: d$1([])
    };
  }
  const GlobalState = G(void 0);
  function hexStr(n2) {
    const hexStr2 = n2.toString(16).toUpperCase();
    return hexStr2.length <= 1 ? "0" + hexStr2 : hexStr2;
  }
  function isDraggedChain(o2) {
    return o2 !== null && typeof o2 === "object" && "chain" in o2 && "from_song" in o2 && typeof o2.chain === "number" && typeof o2.from_song === "string";
  }
  function RenumberButton(props) {
    return u$2("button", {
      type: "button",
      class: "modButton",
      title: `Renumber ${props.name}`,
      onClick: () => props.onClick(),
      children: "#"
    });
  }
  function UnicodeSideAction(side) {
    return side === "left" ? "\u25B6" : "\u25C0";
  }
  function UnicodeSideIcon(side) {
    return side === "left" ? "\u25E7" : "\u25E8";
  }
  function CopyElement(props) {
    let label = UnicodeSideAction(props.from_side);
    return u$2("button", {
      type: "button",
      class: "modButton",
      title: `copy ${props.name} to other song`,
      onClick: () => props.onClick(),
      children: label
    });
  }
  function HexNumberEditor(props) {
    const onDown = (evt) => {
      if (evt.key === "Enter") {
        const strVal = evt.currentTarget.value;
        const asNum = Number.parseInt(strVal, 16);
        props.onValidate(asNum);
      } else if (evt.key === "Escape") {
        props.onCancel();
      }
    };
    const onChange = (evt) => {
      const strVal = evt.currentTarget.value;
      const asNum = Number.parseInt(strVal, 16);
      props.onChange(asNum);
    };
    return u$2("input", {
      autoFocus: true,
      class: "songchain scselect",
      type: "text",
      maxlength: 2,
      pattern: "[a-fA-F0-9]{2}",
      value: hexStr(props.value),
      onChange: (evt) => onChange(evt),
      onKeyDown: (evt) => onDown(evt)
    });
  }
  function NameEditor(props) {
    const onDown = (evt) => {
      if (evt.key === "Enter") {
        const strVal = evt.currentTarget.value;
        props.onValidate(strVal);
      } else if (evt.key === "Escape") {
        props.onCancel();
      }
    };
    const onChange = (evt) => {
      const strVal = evt.currentTarget.value;
      props.onChange(strVal);
    };
    return u$2("input", {
      autoFocus: true,
      class: "nameedit scselect",
      type: "text",
      maxlength: props.max,
      value: props.value,
      onChange: (evt) => onChange(evt),
      onKeyDown: (evt) => onDown(evt)
    });
  }
  function InstrumentList(props) {
    const instruments = allocated_instrument_list$1(props.song);
    const elems = [];
    x(GlobalState);
    const current_edit_name = props.edited_instrument_name.value;
    const edited_name = current_edit_name || EmptyInstrumentNameEdition;
    const current_edit = props.edited_instrument.value;
    const edited_instr = current_edit || EmptyNumberEdition;
    const allow_new_edit = current_edit_name === void 0 && current_edit === void 0;
    const bump = props.bump.value;
    for (const vix of instruments) {
      const real_name = instrument_name$1(props.song, vix);
      let name = real_name === "" ? "\xA0\xA0\xA0\xA0" : real_name;
      const toggle_instr = () => props.edited_instrument.value = {
        base_value: vix,
        current_value: vix
      };
      const toggle_name = () => props.edited_instrument_name.value = {
        instrument_id: vix,
        name: real_name
      };
      const id_change = (v2) => props.edited_instrument.value = {
        ...edited_instr,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_instrument.value = void 0;
        props.undoRedo.renumberInstrument(props.side, edited_instr.base_value, v2);
      };
      const name_change = (name2) => {
        props.edited_instrument_name.value = {
          ...edited_name,
          name: name2
        };
      };
      const name_validate = (name2) => {
        props.edited_instrument_name.value = void 0;
        props.undoRedo.renameInstrument(props.side, edited_name.instrument_id, name2);
      };
      elems.push(u$2("div", {
        class: "instr",
        children: [
          edited_instr.base_value === vix ? u$2(HexNumberEditor, {
            onChange: id_change,
            onValidate: id_validate,
            onCancel: () => props.edited_instrument.value = void 0,
            value: edited_instr.current_value
          }) : u$2("span", {
            onDblClick: allow_new_edit ? toggle_instr : void 0,
            onClick: () => props.selected_instrument.value = vix,
            title: "Double click to renumber",
            children: [
              hexStr(vix),
              " : "
            ]
          }),
          edited_name.instrument_id === vix ? u$2(NameEditor, {
            onValidate: name_validate,
            onChange: name_change,
            onCancel: () => {
              props.edited_instrument_name.value = void 0;
              props.bump.value = bump + 1;
            },
            value: edited_name.name,
            max: 12
          }) : u$2("span", {
            onDblClick: allow_new_edit ? toggle_name : void 0,
            onClick: () => props.selected_instrument.value = vix,
            class: "instr_name",
            title: "Double click to rename",
            children: name
          })
        ]
      }));
    }
    return u$2("pre", {
      children: elems
    });
  }
  function ChainViewer(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    if (song === void 0) return u$2("div", {
      class: "rootcolumn"
    });
    const chain = props.panel.selected_chain.value;
    if (chain === void 0) {
      return u$2("div", {
        class: "rootcolumn",
        children: u$2("p", {
          children: "Select a chain to view"
        })
      });
    }
    const chainSteps = get_chain_steps$1(song, chain);
    const elems = [];
    const phraseSet = (i2) => {
      props.panel.selected_phrase.value = i2;
    };
    for (let i2 = 0; i2 < 32; i2 += 2) {
      elems.push(`${(i2 / 2).toString(16)} : `);
      const phrase = chainSteps[i2];
      if (phrase === 255) {
        elems.push("--\n");
      } else {
        elems.push(u$2("span", {
          class: "phrase",
          onClick: (_2) => phraseSet(phrase),
          children: [
            hexStr(phrase),
            " ",
            hexStr(chainSteps[i2 + 1])
          ]
        }));
        elems.push("\n");
      }
    }
    return u$2("div", {
      class: "chain_viewer",
      children: u$2("pre", {
        children: elems
      })
    });
  }
  function downloadBlob(data, fileName) {
    const blob = new Blob([
      data
    ], {
      type: "application/octet-stream"
    });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function() {
      return window.URL.revokeObjectURL(url);
    }, 1e3);
  }
  function downloadURL(data, fileName) {
    const a2 = document.createElement("a");
    a2.href = data;
    a2.download = fileName;
    document.body.appendChild(a2);
    a2.click();
    a2.remove();
  }
  const empty4_0_url = "" + new URL("V4EMPTY-BJSP-h73.m8s", import.meta.url).href;
  const empty4_1_url = "" + new URL("V4-1BETAEMPTY-CSdRpa-n.m8s", import.meta.url).href;
  async function loadFile(state2, pane, buff) {
    const loaded_file = new Uint8Array(await buff);
    try {
      pane.raw_song.value = loaded_file;
      pane.song.value = load_song$1(loaded_file);
    } catch (err) {
      state2.message_banner.value = err.toString();
    }
  }
  async function loadDroppedSong(state2, ev, pane) {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [
        ...ev.dataTransfer.items
      ].forEach(async (item, i2) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          await loadFile(state2, pane, file.arrayBuffer());
        }
      });
    } else {
      [
        ...ev.dataTransfer.files
      ].forEach(async (file, i2) => {
        pane.loaded_name.value = file.name;
        await loadFile(state2, pane, file.arrayBuffer());
      });
    }
  }
  async function loadUrl(state2, pane, url) {
    const loaded = fetch(url).then((resp) => resp.arrayBuffer());
    await loadFile(state2, pane, loaded);
  }
  function StepsRender(props) {
    const state2 = x(GlobalState);
    const elems = [];
    const pane = props.pane;
    const side = pane.side;
    const steps = props.steps;
    props.pane.bumper.value;
    let read_cursor = 0;
    const dragStart = (evt, chain) => {
      const asJson = {
        chain,
        from_song: side
      };
      evt.dataTransfer.setData("text/plain", JSON.stringify(asJson));
      evt.dataTransfer.dropEffect = "copy";
    };
    const dragOver = (evt) => {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy";
    };
    const dragEnd = (evt, line, col) => {
      const strPayload = evt.dataTransfer.getData("text/plain");
      const asJson = JSON.parse(strPayload);
      if (!isDraggedChain(asJson)) return;
      if (asJson.from_song === side) {
        state2.message_banner.value = "We avoid copying a chain into the same song";
      } else {
        if (props.undoRedo.copyChain(asJson.from_song, asJson.chain, col, line)) pane.bumper.value = pane.bumper.value + 1;
      }
    };
    const selection = pane.selection_range.value || EmptySelection;
    const isSelected = (line, column) => selection.start.x <= column && column <= selection.end.x && selection.end.y <= line && line <= selection.end.y;
    const edition = pane.edited_chain.value || EmptyChainEdition;
    for (let line = 0; line < 256; line++) {
      elems.push(u$2("span", {
        class: "spanline",
        children: [
          hexStr(line),
          " : "
        ]
      }));
      for (let col = 0; col < 8; col++) {
        const chain = steps[read_cursor++];
        const selClass = isSelected(line, col) ? " selected-chain" : "";
        if (chain === 255) {
          const elem = u$2("span", {
            class: "scselect",
            "data-line": line,
            "data-col": col,
            onDragOver: (evt) => dragOver(evt),
            onDrop: (evt) => dragEnd(evt, line, col),
            children: "-- "
          });
          elems.push(elem);
        } else if (edition.x === col && edition.y === line) {
          const onChange = (value) => {
            pane.edited_chain.value = {
              ...edition,
              current_value: value
            };
          };
          const onValidate = (value) => {
            pane.edited_chain.value = void 0;
            try {
              renumber_chain$1(pane.song.value, edition.base_value, value);
            } catch (err) {
              state2.message_banner.value = err.toString();
            }
            pane.bumper.value = pane.bumper.value + 1;
          };
          elems.push(u$2(HexNumberEditor, {
            value: edition.current_value,
            onChange,
            onValidate,
            onCancel: () => {
              pane.edited_chain.value = void 0;
              pane.bumper.value = pane.bumper.value + 1;
            }
          }));
        } else {
          const elem = u$2("span", {
            class: "songchain scselect" + selClass,
            "data-line": line,
            "data-col": col,
            draggable: true,
            title: "Double click to renumber",
            onDragStart: (evt) => dragStart(evt, chain),
            onDragOver: (evt) => dragOver(evt),
            onDrop: (evt) => dragEnd(evt, line, col),
            onDblClick: () => pane.edited_chain.value = {
              x: col,
              y: line,
              current_value: chain,
              base_value: chain
            },
            onClick: () => pane.selected_chain.value = chain,
            children: [
              hexStr(chain),
              " "
            ]
          });
          elems.push(elem);
        }
      }
      elems.push("\n");
    }
    return u$2("pre", {
      class: "songsteps",
      children: elems
    });
  }
  const versionHelpText = "Song version is important for writing song, you can only write a song of the same version, you can transfert across version though.";
  function SongHeader(props) {
    const state2 = x(GlobalState);
    const panel = props.panel;
    const song = panel.song.value;
    panel.bumper.value;
    if (song === void 0) {
      const debugLoad = void 0;
      return u$2("div", {
        class: "rootcolumn",
        children: [
          u$2("button", {
            onClick: () => loadUrl(state2, panel, empty4_0_url),
            title: versionHelpText,
            children: "Load v4.0 empty song"
          }),
          u$2("button", {
            onClick: () => loadUrl(state2, panel, empty4_1_url),
            title: versionHelpText,
            children: "Load v4.1 empty song"
          }),
          debugLoad,
          u$2("div", {
            class: "filetarget",
            onDragOver: (ev) => ev.preventDefault(),
            onDrop: (evt) => loadDroppedSong(state2, evt, props.panel),
            children: u$2("span", {
              children: "Drag M8 song file here"
            })
          })
        ]
      });
    }
    const songName = song_name$1(song);
    const songVersion = song_version$1(song);
    const save = () => {
      try {
        const new_song = write_song$1(song, panel.raw_song.value);
        panel.raw_song.value = new_song;
        downloadBlob(new_song, songName + ".m8s");
      } catch (err) {
        state2.message_banner.value = err.toString();
      }
    };
    const clear = () => {
      clearPanel(props.panel);
    };
    const activeTab = props.panel.active_view.value;
    return u$2("div", {
      children: [
        u$2("h3", {
          style: "display: inline-block;",
          title: `'${panel.loaded_name}' version ${songVersion}`,
          children: songName
        }),
        u$2("span", {
          class: "separator"
        }),
        u$2("button", {
          onClick: save,
          children: "Save"
        }),
        u$2("button", {
          onClick: clear,
          children: "Clear"
        }),
        u$2("div", {
          class: "tabcontainer",
          children: u$2("div", {
            class: "tabs",
            children: [
              u$2("div", {
                class: "tab" + (activeTab === "song" ? " tabactive" : ""),
                onClick: () => props.panel.active_view.value = "song",
                children: "Song"
              }),
              u$2("div", {
                class: "tab" + (activeTab === "spectra" ? " tabactive" : ""),
                onClick: () => props.panel.active_view.value = "spectra",
                children: "Spectraview"
              })
            ]
          })
        })
      ]
    });
  }
  function SongViewer(props) {
    const panel = props.panel;
    const song = panel.song.value;
    panel.bumper.value;
    if (song === void 0) return u$2(b$1, {});
    const steps = get_song_steps$1(song);
    return u$2("div", {
      class: "rootcolumn",
      children: u$2("div", {
        class: "songsteps-wrapper",
        children: u$2(StepsRender, {
          steps,
          pane: props.panel,
          undoRedo: props.undoRedo
        })
      })
    });
  }
  function PhraseList(props) {
    const phrases = allocated_phrase_list$1(props.song);
    const elems = [];
    const state2 = x(GlobalState);
    const current_edit = props.edited_phrase.value;
    const edited_phrase = current_edit || EmptyNumberEdition;
    const allow_new_edit = current_edit === void 0;
    const bump = props.bump.value;
    let bucket = [];
    let prevPhrase = phrases.length > 0 ? phrases[0] : 0;
    for (const vix of phrases) {
      const toggle_phrase = () => props.edited_phrase.value = {
        base_value: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_phrase.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_phrase.value = void 0;
        try {
          renumber_phrase$1(props.song, edited_phrase.base_value, v2);
          props.bump.value = bump + 1;
        } catch (err) {
          state2.message_banner.value = err.toString();
        }
      };
      if ((prevPhrase / 16 | 0) !== (vix / 16 | 0)) {
        elems.push(u$2("div", {
          class: "instr",
          children: bucket
        }));
        bucket = [];
      }
      prevPhrase = vix;
      bucket.push(edited_phrase.base_value === vix ? u$2(HexNumberEditor, {
        onChange: id_change,
        onValidate: id_validate,
        onCancel: () => props.edited_phrase.value = void 0,
        value: edited_phrase.current_value
      }) : u$2("span", {
        onDblClick: allow_new_edit ? toggle_phrase : void 0,
        onClick: () => props.selected_phrase.value = vix,
        title: "Double click to renumber phrase",
        children: [
          hexStr(vix),
          " "
        ]
      }));
    }
    if (bucket.length !== 0) {
      elems.push(u$2("div", {
        class: "instr",
        children: bucket
      }));
    }
    return u$2("pre", {
      children: elems
    });
  }
  function PhraseViewer(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    if (song === void 0) return void 0;
    const phrase_idx = props.panel.selected_phrase.value;
    return phrase_idx !== void 0 ? u$2("pre", {
      children: show_phrase$1(song, phrase_idx)
    }) : void 0;
  }
  function TableViewer(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    if (song === void 0) return void 0;
    const table_idx = props.panel.selected_table.value;
    return table_idx !== void 0 ? u$2("pre", {
      children: show_table$1(song, table_idx)
    }) : void 0;
  }
  function ChainList(props) {
    const phrases = allocated_chain_list$1(props.song);
    const elems = [];
    const state2 = x(GlobalState);
    const current_edit = props.edited_chain.value;
    const edited_chain = current_edit || EmptyChainEdition;
    const allow_new_edit = current_edit === void 0;
    const bump = props.bump.value;
    let bucket = [];
    let prevPhrase = phrases.length > 0 ? phrases[0] : 0;
    for (const vix of phrases) {
      const toggle_phrase = () => props.edited_chain.value = {
        x: -1,
        y: -1,
        base_value: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_chain.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_chain.value = void 0;
        try {
          renumber_chain$1(props.song, edited_chain.base_value, v2);
          props.bump.value = bump + 1;
        } catch (err) {
          state2.message_banner.value = err.toString();
        }
      };
      if ((prevPhrase / 16 | 0) !== (vix / 16 | 0)) {
        elems.push(u$2("div", {
          class: "instr",
          children: bucket
        }));
        bucket = [];
      }
      prevPhrase = vix;
      bucket.push(edited_chain.base_value === vix ? u$2(HexNumberEditor, {
        onChange: id_change,
        onValidate: id_validate,
        onCancel: () => props.edited_chain.value = void 0,
        value: edited_chain.current_value
      }) : u$2("span", {
        onDblClick: allow_new_edit ? toggle_phrase : void 0,
        onClick: () => props.selected_chain.value = vix,
        title: "Double click to renumber chain",
        children: [
          hexStr(vix),
          " "
        ]
      }));
    }
    if (bucket.length !== 0) {
      elems.push(u$2("div", {
        class: "instr",
        children: bucket
      }));
    }
    return u$2("pre", {
      children: elems
    });
  }
  function TableList(props) {
    const phrases = allocated_table$1(props.song);
    const elems = [];
    const state2 = x(GlobalState);
    const current_edit = props.edited_table.value;
    const edited_phrase = current_edit || EmptyNumberEdition;
    const allow_new_edit = current_edit === void 0;
    const bump = props.bump.value;
    let bucket = [];
    let prevPhrase = phrases.length > 0 ? phrases[0] : 0;
    for (const vix of phrases) {
      const toggle_table = () => props.edited_table.value = {
        base_value: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_table.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_table.value = void 0;
        try {
          renumber_table$1(props.song, edited_phrase.base_value, v2);
          props.bump.value = bump + 1;
        } catch (err) {
          state2.message_banner.value = err.toString();
        }
      };
      if ((prevPhrase / 16 | 0) !== (vix / 16 | 0)) {
        elems.push(u$2("div", {
          class: "instr",
          children: bucket
        }));
        bucket = [];
      }
      prevPhrase = vix;
      bucket.push(edited_phrase.base_value === vix ? u$2(HexNumberEditor, {
        onChange: id_change,
        onValidate: id_validate,
        onCancel: () => props.edited_table.value = void 0,
        value: edited_phrase.current_value
      }) : u$2("span", {
        onDblClick: allow_new_edit ? toggle_table : void 0,
        onClick: () => props.selected_table.value = vix,
        title: "Double click to renumber table",
        children: [
          hexStr(vix),
          " "
        ]
      }));
    }
    if (bucket.length !== 0) {
      elems.push(u$2("div", {
        class: "instr",
        children: bucket
      }));
    }
    return u$2("pre", {
      children: elems
    });
  }
  function HexGauge(props) {
    return u$2("div", {
      class: "hexgauge",
      style: "--hex: " + props.v
    });
  }
  function HexRender(props) {
    return u$2(b$1, {
      children: [
        u$2("td", {
          children: props.v.name
        }),
        u$2("td", {
          children: hexStr(props.v.hex)
        }),
        u$2("td", {
          children: u$2(HexGauge, {
            v: props.v.hex
          })
        })
      ]
    });
  }
  function BoolRender(props) {
    return u$2(b$1, {
      children: [
        u$2("td", {
          children: props.v.name
        }),
        u$2("td", {
          colSpan: 2,
          children: props.v.bool ? "ON" : "OFF"
        })
      ]
    });
  }
  function FloatRender(props) {
    return u$2("li", {
      children: [
        props.v.name,
        ": ",
        props.v.f32
      ]
    });
  }
  function StrRender(props) {
    if ("hex" in props.v) {
      return u$2(b$1, {
        children: [
          u$2("td", {
            children: props.v.name
          }),
          u$2("td", {
            children: hexStr(props.v.hex)
          }),
          u$2("td", {
            children: props.v.str
          })
        ]
      });
    }
    return u$2(b$1, {
      children: [
        u$2("td", {
          children: props.v.name
        }),
        u$2("td", {
          colSpan: 2,
          children: props.v.str
        })
      ]
    });
  }
  const MODRenderers = {
    "MOD1": 0,
    "MOD2": 1,
    "MOD3": 2,
    "MOD4": 3
  };
  const CCValues = {
    "CCA": 0,
    "CCB": 1,
    "CCC": 2,
    "CCD": 3,
    "CCE": 4,
    "CCF": 5,
    "CCG": 6,
    "CCH": 7,
    "CCI": 8,
    "CCJ": 9
  };
  function CCRender(props) {
    let cc = 0;
    let val = 1;
    for (const v2 of props.v.nest) {
      if (v2.name === "CC" && "hex" in v2) cc = v2.hex;
      if (v2.name === "VAL" && "hex" in v2) val = v2.hex;
    }
    const fillNum = (n2) => {
      const strN = n2.toString(10);
      if (n2 >= 100) return strN;
      if (n2 >= 10) return "0" + strN;
      return "00" + strN;
    };
    return u$2(b$1, {
      children: [
        u$2("td", {
          children: [
            props.v.name,
            " CC:VAL"
          ]
        }),
        u$2("td", {
          children: [
            fillNum(cc),
            ":",
            hexStr(val)
          ]
        }),
        u$2("td", {
          children: u$2(HexGauge, {
            v: val
          })
        })
      ]
    });
  }
  function FmOperatorRender(desc, legend) {
    const v2 = desc.nest;
    let osc = "";
    let ratio = 0;
    let level = 0;
    let fbk = 0;
    let moda = 0;
    let modb = 0;
    for (const desc2 of v2) {
      if (desc2.name === "SHAPE" && "str" in desc2) {
        osc = desc2.str;
      } else if (desc2.name === "LEVEL" && "hex" in desc2) {
        level = desc2.hex;
      } else if (desc2.name === "FBK" && "hex" in desc2) {
        fbk = desc2.hex;
      } else if (desc2.name === "RATIO" && "f32" in desc2) {
        ratio = desc2.f32;
      } else if (desc2.name === "MOD_A" && "hex" in desc2) {
        moda = desc2.hex;
      } else if (desc2.name === "MOD_B" && "hex" in desc2) {
        modb = desc2.hex;
      }
    }
    return [
      u$2(b$1, {
        children: [
          legend ? u$2("td", {}) : void 0,
          u$2("td", {
            children: [
              desc.name,
              " ",
              osc
            ]
          })
        ]
      }),
      u$2(b$1, {
        children: [
          legend ? u$2("td", {
            children: "RATIO"
          }) : void 0,
          u$2("td", {
            children: ratio
          })
        ]
      }),
      u$2(b$1, {
        children: [
          legend ? u$2("td", {
            children: "LEV/FB"
          }) : void 0,
          u$2("td", {
            children: [
              hexStr(level),
              "/",
              hexStr(fbk)
            ]
          })
        ]
      }),
      u$2(b$1, {
        children: [
          legend ? u$2("td", {
            children: "MOD"
          }) : void 0,
          u$2("td", {
            children: hexStr(moda)
          })
        ]
      }),
      u$2(b$1, {
        children: [
          legend ? u$2("td", {}) : void 0,
          u$2("td", {
            children: hexStr(modb)
          })
        ]
      })
    ];
  }
  function ModRender(props) {
    const lines = props.v.map((desc) => {
      if (!("hex" in desc)) return void 0;
      if (desc.name in MODRenderers) {
        return u$2("tr", {
          children: [
            u$2("th", {
              children: desc.name
            }),
            u$2("td", {
              children: hexStr(desc.hex)
            }),
            u$2("th", {
              children: "str" in desc ? desc.str : u$2(HexGauge, {
                v: desc.hex
              })
            })
          ]
        });
      }
      return u$2("tr", {
        children: [
          u$2("td", {
            children: desc.name
          }),
          u$2("td", {
            children: hexStr(desc.hex)
          }),
          u$2("td", {
            children: "str" in desc ? desc.str : u$2(HexGauge, {
              v: desc.hex
            })
          })
        ]
      });
    });
    return u$2("table", {
      children: u$2("tbody", {
        children: lines
      })
    });
  }
  function DescriptorRender(props) {
    const { desc } = props;
    if ("str" in desc) return u$2(StrRender, {
      v: desc
    });
    if ("hex" in desc) return u$2(HexRender, {
      v: desc
    });
    if ("bool" in desc) return u$2(BoolRender, {
      v: desc
    });
    if ("f32" in desc) return u$2(FloatRender, {
      v: desc
    });
    if ("nest" in desc) {
      const descriptors = desc.nest.map((d2) => {
        if (d2.name in CCValues && "nest" in d2) return u$2(CCRender, {
          v: d2
        });
        return u$2(DescriptorRender, {
          desc: d2
        });
      });
      return u$2("div", {
        class: "instrparam",
        children: [
          u$2("span", {
            children: desc.name
          }),
          u$2("ul", {
            children: descriptors
          })
        ]
      });
    }
    return void 0;
  }
  const InRightColumn = {
    "AMP": 1,
    "LIM": 1,
    "PAN": 1,
    "DRY": 1,
    "CHORUS": 1,
    "DELAY": 1,
    "REVERB": 1,
    "ALG": 2,
    "SCALE": 2,
    "CHORD": 2,
    "SAMPLE": 2,
    "PORT": 2,
    "CHANNEL": 2,
    "BANK": 2,
    "PROGRAM": 2,
    "PLAY": 2,
    "SHAPE": 2,
    "SLICE": 2
  };
  const OperatorName = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3
  };
  function RootDescriptorRender(props) {
    const { desc } = props;
    if ("str" in desc) return u$2(StrRender, {
      v: desc
    });
    if ("hex" in desc) return u$2(HexRender, {
      v: desc
    });
    if ("bool" in desc) return u$2(BoolRender, {
      v: desc
    });
    if ("f32" in desc) return u$2(FloatRender, {
      v: desc
    });
    if ("nest" in desc) {
      const buckets = [
        [],
        [],
        []
      ];
      const operators = [];
      const mods = [
        void 0,
        void 0,
        void 0,
        void 0
      ];
      let name = "";
      let transpose = true;
      let tblTic = 1;
      let eq = 255;
      for (const d2 of desc.nest) {
        if (d2.name === "NAME" && "str" in d2) {
          name = d2.str;
          continue;
        }
        if (d2.name === "TRANSPOSE" && "bool" in d2) {
          transpose = d2.bool;
          continue;
        }
        if (d2.name === "TBL. TIC" && "hex" in d2) {
          tblTic = d2.hex;
          continue;
        }
        if (d2.name === "EQ" && "hex" in d2) {
          eq = d2.hex;
          continue;
        }
        if (d2.name in OperatorName && "nest" in d2) {
          const ix2 = OperatorName[d2.name];
          operators[ix2] = FmOperatorRender(d2, d2.name === "A");
          continue;
        }
        const asMod = MODRenderers[d2.name];
        if (asMod !== void 0 && "nest" in d2) {
          mods[asMod] = u$2(ModRender, {
            v: d2.nest
          });
          continue;
        }
        const ix = d2.name in InRightColumn ? InRightColumn[d2.name] : 0;
        if (d2.name in CCValues && "nest" in d2) {
          buckets[ix].push(u$2(CCRender, {
            v: d2
          }));
        } else {
          buckets[ix].push(u$2(DescriptorRender, {
            desc: d2
          }));
        }
      }
      const maxi = Math.max(buckets[0].length, buckets[1].length);
      const lines = [];
      for (let i2 = 0; i2 < maxi; i2++) {
        const left = i2 < buckets[0].length ? buckets[0][i2] : u$2("td", {
          colSpan: 3
        });
        const right = i2 < buckets[1].length ? buckets[1][i2] : void 0;
        lines.push(u$2("tr", {
          children: [
            left,
            right
          ]
        }));
      }
      const globalLines = buckets[2].map((elems) => u$2("tr", {
        children: elems
      }));
      if (operators.length > 0) {
        let max = operators[0].length;
        for (let i2 = 0; i2 < max; i2++) {
          globalLines.push(u$2("tr", {
            children: [
              operators[0][i2],
              operators[1][i2],
              operators[2][i2],
              operators[3][i2]
            ]
          }));
        }
      }
      return u$2("div", {
        class: "instrparam",
        children: [
          u$2("span", {
            children: desc.name
          }),
          u$2("div", {
            children: [
              "NAME ",
              name
            ]
          }),
          u$2("div", {
            children: [
              u$2("span", {
                children: [
                  "TRANSP. ",
                  transpose ? "ON" : "OFF"
                ]
              }),
              "\xA0\xA0",
              u$2("span", {
                children: [
                  "TBL TIC. ",
                  hexStr(tblTic)
                ]
              }),
              "\xA0\xA0",
              u$2("span", {
                children: [
                  "EQ ",
                  eq >= 32 ? "--" : hexStr(eq)
                ]
              })
            ]
          }),
          u$2("table", {
            children: u$2("tbody", {
              children: globalLines
            })
          }),
          u$2("table", {
            children: u$2("tbody", {
              children: lines
            })
          }),
          u$2("table", {
            children: u$2("tbody", {
              children: [
                u$2("tr", {
                  children: [
                    u$2("td", {
                      children: mods[0]
                    }),
                    u$2("td", {
                      children: mods[2]
                    })
                  ]
                }),
                u$2("tr", {
                  children: [
                    u$2("td", {
                      children: mods[1]
                    }),
                    u$2("td", {
                      children: mods[3]
                    })
                  ]
                })
              ]
            })
          })
        ]
      });
    }
    return void 0;
  }
  function InstrumentViewer(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    const selected = props.panel.selected_instrument.value;
    const state2 = x(GlobalState);
    if (song === void 0 || selected === void 0) return void 0;
    let info = [];
    try {
      info = describe_instrument$1(song, selected);
    } catch (err) {
      state2.message_banner.value = err.toString();
      return void 0;
    }
    return u$2("div", {
      class: "instrparam",
      children: info.map((d2) => u$2(RootDescriptorRender, {
        desc: d2
      }))
    });
  }
  function EqList(props) {
    const eqs = allocated_eq_list$1(props.song);
    const elems = [];
    const eqPerRow = 8;
    let bucket = [];
    let prevEq = eqs.length > 0 ? eqs[0] : 0;
    for (const vix of eqs) {
      if ((prevEq / eqPerRow | 0) !== (vix / eqPerRow | 0)) {
        elems.push(u$2("div", {
          class: "instr",
          children: bucket
        }));
        bucket = [];
      }
      prevEq = vix;
      bucket.push(u$2("span", {
        onClick: () => props.selected_eq.value = vix,
        children: [
          hexStr(vix),
          " "
        ]
      }));
    }
    if (bucket.length !== 0) {
      elems.push(u$2("div", {
        class: "instr",
        children: bucket
      }));
    }
    return u$2("pre", {
      children: elems
    });
  }
  function BandViewer(desc, onMode) {
    let gain = 0;
    let freq = 0;
    let q2 = 0;
    let type = "";
    let mode = "";
    for (const d2 of desc.nest) {
      if (d2.name === "GAIN" && "f32" in d2) gain = d2.f32;
      if (d2.name === "FREQ" && "f32" in d2) freq = d2.f32;
      if (d2.name === "Q" && "hex" in d2) q2 = d2.hex;
      if (d2.name === "TYPE" && "str" in d2) type = d2.str;
      if (d2.name === "MODE" && "str" in d2) {
        mode = d2.str;
        if ("hex" in d2) {
          onMode(d2.hex);
        }
      }
    }
    return [
      u$2("td", {
        children: gain
      }),
      u$2("td", {
        children: freq
      }),
      u$2("td", {
        children: q2
      }),
      u$2("td", {
        children: type
      }),
      u$2("td", {
        children: mode
      })
    ];
  }
  const NAMES = [
    "GAIN",
    "FREQ",
    "Q",
    "TYPE",
    "MODE"
  ];
  function DrawEq(context, ys, color) {
    const height = context.canvas.clientHeight;
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = 1;
    let px = 0;
    let py = 0;
    const yy = ys[0] * 100;
    py = height - yy - 70;
    px = 0;
    for (let x2 = 1; x2 < ys.length; x2++) {
      const y2 = ys[x2] * 100;
      context.beginPath();
      context.moveTo(px, py);
      px = x2;
      py = height - y2 - 70;
      context.lineTo(x2, py);
      context.stroke();
    }
  }
  function DrawEqFrequencyBars(context, freqs) {
    const width = context.canvas.clientWidth;
    const height = context.canvas.clientHeight;
    let target = 10;
    let previous = 0;
    context.fillStyle = "#555";
    context.font = "monospace";
    for (let i2 = 0; i2 < freqs.length; i2++) {
      const f2 = freqs[i2];
      if (f2 >= target && previous < target) {
        context.fillRect(i2, 0, 1, height);
        context.fillText(target.toString(10), i2 - 10, 8);
        target *= 10;
      }
      previous = f2;
    }
    const db0 = 0;
    context.fillRect(0, height - db0 - 70, width, 1);
  }
  const COLOR_MODE = [
    "#ddd",
    "#d0d",
    "#dd0",
    "#0dd",
    "#0d0"
  ];
  function EqPlot(props) {
    let ys = new Float64Array(0);
    let freqs = eq_frequencies$1();
    const canvasRef = A(null);
    y$1(() => {
      const current = canvasRef.current;
      if (current === null) return;
      const context = current.getContext("2d");
      if (context === null) return;
      const width = context.canvas.clientWidth;
      const height = context.canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      DrawEqFrequencyBars(context, freqs);
      for (const mode of props.eq_modes) {
        try {
          ys = plot_eq$1(props.song, props.eq, mode);
        } catch (err) {
          props.banner.value = err;
        }
        DrawEq(context, ys, COLOR_MODE[mode]);
      }
    });
    return u$2("canvas", {
      ref: canvasRef,
      width: 300,
      height: 150
    });
  }
  function EqParamViewer(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    const selected = props.eq;
    const state2 = x(GlobalState);
    if (song === void 0 || selected === void 0) {
      return {
        dom: void 0,
        modes: void 0
      };
    }
    let info = [];
    try {
      info = describe_eq$1(song, selected);
    } catch (err) {
      state2.message_banner.value = err.toString();
      return {
        dom: void 0,
        modes: void 0
      };
    }
    let low = [];
    let mid = [];
    let high = [];
    let modes = /* @__PURE__ */ new Set();
    for (const nfo of info) {
      if (nfo.name === "LOW" && "nest" in nfo) {
        low = BandViewer(nfo, (m2) => modes = modes.add(m2));
      }
      if (nfo.name === "MID" && "nest" in nfo) {
        mid = BandViewer(nfo, (m2) => modes = modes.add(m2));
      }
      if (nfo.name === "HIGH" && "nest" in nfo) {
        high = BandViewer(nfo, (m2) => modes = modes.add(m2));
      }
    }
    const final = [];
    for (let i2 = 0; i2 < NAMES.length; i2++) {
      final.push(u$2("tr", {
        children: [
          u$2("td", {
            children: NAMES[i2]
          }),
          low[i2],
          mid[i2],
          high[i2]
        ]
      }));
    }
    const dom = u$2("table", {
      children: [
        u$2("thead", {
          children: u$2("tr", {
            children: [
              u$2("th", {}),
              u$2("th", {
                children: "LOW"
              }),
              u$2("th", {
                children: "MID"
              }),
              u$2("th", {
                children: "HIGH"
              })
            ]
          })
        }),
        u$2("tbody", {
          children: final
        })
      ]
    });
    return {
      dom,
      modes
    };
  }
  function EqViewer(props) {
    const selected = props.panel.selected_eq.value;
    if (selected === void 0) return void 0;
    return u$2("div", {
      class: "instrparam",
      children: u$2(EqViewerAt, {
        panel: props.panel,
        eq: selected,
        banner: props.banner
      })
    });
  }
  function EqViewerAt(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    const selected = props.eq;
    if (song === void 0) return void 0;
    const paramView = EqParamViewer({
      panel: props.panel,
      banner: props.banner,
      eq: selected
    });
    return u$2(b$1, {
      children: [
        u$2(EqPlot, {
          song,
          eq: selected,
          banner: props.banner,
          eq_modes: Array.from(paramView.modes ?? [])
        }),
        paramView.dom
      ]
    });
  }
  class UndoRedoer {
    constructor(state2) {
      this.state = state2;
    }
    errLog(ref, message) {
      this.state.message_banner.value = message;
      this.pushLog({
        kind: "error",
        ref,
        message
      });
    }
    songSide(side) {
      const panel = side === "left" ? this.state.left : this.state.right;
      const song = panel.song.value;
      const song_name2 = song_name$1(song);
      return [
        song,
        {
          side,
          song_name: song_name2
        }
      ];
    }
    otherSongSide(side) {
      return this.songSide(side === "left" ? "right" : "left");
    }
    undoTo(pos) {
      const current = this.state.undo_stack_pointer.value;
      const log = this.state.remap_log.value;
      if (pos === current) return;
      if (pos > current) {
        for (let i2 = current; i2 <= pos; i2++) {
          this.apply(log[i2]);
        }
        this.state.undo_stack_pointer.value = pos + 1;
      } else {
        for (let i2 = current - 1; i2 >= pos; i2--) {
          this.revApply(log[i2]);
        }
        this.state.undo_stack_pointer.value = pos;
      }
      this.state.left.bumper.value = this.state.left.bumper.value + 1;
      this.state.right.bumper.value = this.state.right.bumper.value + 1;
    }
    pushLog(l2) {
      const old_log = this.state.remap_log.value;
      const old_pointer = this.state.undo_stack_pointer.value;
      if (old_pointer === old_log.length) {
        this.state.undo_stack_pointer.value = old_pointer + 1;
        this.state.remap_log.value = [
          ...old_log,
          l2
        ];
      } else {
        const new_log = [
          ...old_log.slice(0, old_pointer),
          l2
        ];
        this.state.undo_stack_pointer.value = new_log.length;
        this.state.remap_log.value = new_log;
      }
    }
    copyPhrase(side, phrase) {
      const [song, from_ref] = this.songSide(side);
      const [other, to_ref] = this.otherSongSide(side);
      if (other === void 0) return;
      try {
        const data = dump_phrase$1(song, phrase);
        copy_phrase$1(song, other, phrase, phrase);
        this.pushLog({
          kind: "move",
          from_ref,
          to_ref,
          patch: [
            {
              kind: "PHR",
              from_id: phrase,
              to_id: phrase,
              data
            }
          ]
        });
      } catch (err) {
        this.errLog(to_ref, err.toString());
      }
      return true;
    }
    renumberPhrase(side, base_phrase, new_phrase) {
      if (base_phrase === new_phrase) return true;
      const [song, songRef] = this.songSide(side);
      try {
        renumber_phrase$1(song, base_phrase, new_phrase);
        this.pushLog({
          kind: "renumber",
          ref: songRef,
          elemKind: "PHR",
          old_value: base_phrase,
          new_value: new_phrase
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
        return false;
      }
      return true;
    }
    renumberChain(side, base_chain, to_chain) {
      if (base_chain === to_chain) return true;
      const [song, songRef] = this.songSide(side);
      try {
        renumber_chain$1(song, base_chain, to_chain);
        this.pushLog({
          kind: "renumber",
          ref: songRef,
          elemKind: "CHN",
          old_value: base_chain,
          new_value: to_chain
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
        return false;
      }
      return true;
    }
    renumberTable(side, base_table, to_table) {
      if (base_table === to_table) return true;
      const [song, songRef] = this.songSide(side);
      try {
        renumber_table$1(song, base_table, to_table);
        this.pushLog({
          kind: "renumber",
          ref: songRef,
          elemKind: "TBL",
          old_value: base_table,
          new_value: to_table
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
        return false;
      }
      return true;
    }
    copyTable(side, table) {
      const [song, from_ref] = this.songSide(side);
      const [other, to_ref] = this.otherSongSide(side);
      if (other === void 0) return;
      const data = dump_table$1(other, table);
      copy_table$1(song, other, table, table);
      this.pushLog({
        kind: "move",
        from_ref,
        to_ref,
        patch: [
          {
            kind: "TBL",
            from_id: table,
            to_id: table,
            data
          }
        ]
      });
    }
    renumberInstrument(side, base_instr, to_instr) {
      if (base_instr === to_instr) return true;
      const [song, songRef] = this.songSide(side);
      try {
        renumber_instrument$1(song, base_instr, to_instr);
        this.pushLog({
          kind: "renumber",
          ref: songRef,
          elemKind: "INS",
          old_value: base_instr,
          new_value: to_instr
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
        return false;
      }
      return true;
    }
    copyInstrument(side, instr) {
      const [song, from_ref] = this.songSide(side);
      const [other, to_ref] = this.otherSongSide(side);
      if (other === void 0) return;
      const data = dump_instrument$1(other, instr);
      copy_instrument$1(song, other, instr, instr);
      this.pushLog({
        kind: "move",
        from_ref,
        to_ref,
        patch: [
          {
            kind: "INS",
            from_id: instr,
            to_id: instr,
            data
          }
        ]
      });
    }
    renumberEq(side, base_eq, to_eq) {
      if (base_eq === to_eq) return true;
      const [song, songRef] = this.songSide(side);
      try {
        renumber_eq$1(song, base_eq, to_eq);
        this.pushLog({
          kind: "renumber",
          ref: songRef,
          elemKind: "EQ",
          old_value: base_eq,
          new_value: to_eq
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
        return false;
      }
      return true;
    }
    copyEq(side, eq) {
      const [song, from_ref] = this.songSide(side);
      const [other, to_ref] = this.otherSongSide(side);
      if (other === void 0) return;
      const data = dump_eq$1(other, eq);
      copy_eq$1(song, other, eq, eq);
      this.pushLog({
        kind: "move",
        from_ref,
        to_ref,
        patch: [
          {
            kind: "EQ",
            from_id: eq,
            to_id: eq,
            data
          }
        ]
      });
    }
    renameInstrument(side, instr, new_name) {
      const [song, songRef] = this.songSide(side);
      try {
        const old_name = instrument_name$1(song, instr);
        if (old_name === new_name) return;
        rename_instrument$1(song, instr, new_name);
        this.pushLog({
          kind: "rename",
          ref: songRef,
          instr,
          old_name,
          new_name
        });
      } catch (err) {
        this.errLog(songRef, err.toString());
      }
    }
    toPatch(song, log) {
      let arr = void 0;
      let x2 = void 0;
      let y2 = void 0;
      switch (log.kind) {
        case "CHN":
          arr = dump_chain$1(song, log.to);
          break;
        case "PHR":
          arr = dump_phrase$1(song, log.to);
          break;
        case "INS":
          arr = dump_instrument$1(song, log.to);
          break;
        case "EQ":
          arr = dump_eq$1(song, log.to);
          break;
        case "TBL":
          arr = dump_table$1(song, log.to);
          break;
        case "SNGSTEP":
          x2 = log.x;
          y2 = log.y;
          break;
      }
      return {
        kind: log.kind,
        from_id: log.from,
        to_id: log.to,
        data: arr,
        pos: x2 !== void 0 && y2 !== void 0 ? {
          x: x2,
          y: y2
        } : void 0
      };
    }
    revApply(l2) {
      switch (l2.kind) {
        case "error":
          break;
        case "renumber": {
          let [song, _2] = this.songSide(l2.ref.side);
          switch (l2.elemKind) {
            case "CHN":
              renumber_chain$1(song, l2.new_value, l2.old_value);
              break;
            case "PHR":
              renumber_phrase$1(song, l2.new_value, l2.old_value);
              break;
            case "INS":
              renumber_instrument$1(song, l2.new_value, l2.old_value);
              break;
            case "EQ":
              renumber_eq$1(song, l2.new_value, l2.old_value);
              break;
            case "TBL":
              renumber_table$1(song, l2.new_value, l2.old_value);
              break;
          }
          break;
        }
        case "rename": {
          let [song, _2] = this.songSide(l2.ref.side);
          rename_instrument$1(song, l2.instr, l2.old_name);
          break;
        }
        case "move": {
          const patches = l2.patch;
          const [song, _2] = this.songSide(l2.to_ref.side);
          for (let i2 = patches.length - 1; i2 >= 0; i2--) {
            const patch = patches[i2];
            switch (patch.kind) {
              case "CHN":
                blast_chain$1(song, patch.to_id, patch.data);
                break;
              case "PHR":
                blast_phrase$1(song, patch.to_id, patch.data);
                break;
              case "INS":
                blast_instrument$1(song, patch.to_id, patch.data);
                break;
              case "EQ":
                blast_eq$1(song, patch.to_id, patch.data);
                break;
              case "TBL":
                blast_table$1(song, patch.to_id, patch.data);
                break;
              case "SNGSTEP":
                set_song_step$1(song, patch.pos.x, patch.pos.y, patch.from_id);
                break;
            }
          }
          break;
        }
      }
    }
    apply(l2) {
      switch (l2.kind) {
        case "error":
          break;
        case "renumber": {
          let [song, _2] = this.songSide(l2.ref.side);
          switch (l2.elemKind) {
            case "CHN":
              renumber_chain$1(song, l2.old_value, l2.new_value);
              break;
            case "PHR":
              renumber_phrase$1(song, l2.old_value, l2.new_value);
              break;
            case "INS":
              renumber_instrument$1(song, l2.old_value, l2.new_value);
              break;
            case "EQ":
              renumber_eq$1(song, l2.old_value, l2.new_value);
              break;
            case "TBL":
              renumber_table$1(song, l2.old_value, l2.new_value);
              break;
          }
          break;
        }
        case "rename": {
          let [song, _2] = this.songSide(l2.ref.side);
          rename_instrument$1(song, l2.instr, l2.new_name);
          break;
        }
        case "move": {
          const patches = l2.patch;
          const [from_song, _from_name] = this.songSide(l2.from_ref.side);
          const [to_song, _to_name] = this.songSide(l2.to_ref.side);
          for (const patch of patches) {
            switch (patch.kind) {
              case "CHN":
                copy_chain_raw$1(from_song, to_song, patch.from_id, patch.to_id);
                break;
              case "PHR":
                copy_phrase$1(from_song, to_song, patch.from_id, patch.to_id);
                break;
              case "INS":
                copy_instrument$1(from_song, to_song, patch.from_id, patch.to_id);
                break;
              case "EQ":
                copy_eq$1(from_song, to_song, patch.from_id, patch.to_id);
                break;
              case "TBL":
                copy_table$1(from_song, to_song, patch.from_id, patch.to_id);
                break;
              case "SNGSTEP":
                set_song_step$1(to_song, patch.pos.x, patch.pos.y, patch.to_id);
                break;
            }
          }
          break;
        }
      }
    }
    copyChain(from_song, chain, col, line) {
      const [from, from_ref] = this.songSide(from_song);
      const [to, to_ref] = this.otherSongSide(from_song);
      try {
        const remapping = remap_chain$1(from, to, chain);
        const objRemapping = describe_mapping$1(remapping);
        const old_sng = pick_song_step$1(to, col, line);
        remap_chain_apply$1(from, to, remapping, chain, col, line);
        objRemapping.push({
          kind: "SNGSTEP",
          from: old_sng,
          to: pick_song_step$1(to, col, line),
          x: col,
          y: line
        });
        const patch = objRemapping.map((log) => this.toPatch(to, log));
        this.pushLog({
          kind: "move",
          from_ref,
          to_ref,
          patch
        });
      } catch (err) {
        this.errLog(to_ref, `Chain copy error: ${err}`);
        return false;
      }
      return true;
    }
  }
  function InstrumentView(props) {
    const instr_name = instrument_name$1(props.song, props.ix);
    const succint = describe_succint_instrument$1(props.song, props.ix);
    let eq = -1;
    let isMidi = false;
    for (const s2 of succint) {
      if (s2.name == "EQ" && "hex" in s2) eq = s2.hex;
      if (s2.name == "KIND" && "str" in s2) isMidi = s2.str === "MIDIOUT";
    }
    return u$2("div", {
      class: "succint",
      children: [
        u$2("div", {
          class: "succintfields",
          children: u$2("table", {
            children: [
              u$2("tr", {
                children: u$2("th", {
                  colSpan: 2,
                  children: [
                    hexStr(props.ix),
                    " ",
                    instr_name
                  ]
                })
              }),
              succint.map((d2) => u$2("tr", {
                children: u$2(DescriptorRender, {
                  desc: d2
                })
              }))
            ]
          })
        }),
        eq >= 0 && eq < 35 && !isMidi ? u$2(EqViewerAt, {
          panel: props.panel,
          banner: props.banner,
          eq
        }) : void 0
      ]
    });
  }
  function SpectraView(props) {
    const song = props.panel.song.value;
    props.panel.bumper.value;
    if (song === void 0) return u$2(b$1, {});
    const instruments = allocated_instrument_list$1(song);
    const views = [];
    for (const idx of instruments) {
      views.push(u$2(InstrumentView, {
        panel: props.panel,
        song,
        ix: idx,
        banner: props.banner
      }));
    }
    return u$2("div", {
      children: views
    });
  }
  init$1();
  const state = initState();
  function EditControls(props) {
    const { name, side, selected, edited_number } = props;
    const selectedElement = selected.value;
    const edited = edited_number.value;
    const renumbering = props.canRenumber !== void 0 && !props.canRenumber(selectedElement) ? void 0 : edited === void 0 ? u$2(RenumberButton, {
      name,
      onClick: () => edited_number.value = {
        base_value: selectedElement,
        current_value: selectedElement
      }
    }) : u$2(HexNumberEditor, {
      value: edited.current_value,
      onChange: (v2) => edited_number.value = {
        ...edited,
        current_value: v2
      },
      onCancel: () => edited_number.value = void 0,
      onValidate: (v2) => {
        edited_number.value = void 0;
        props.onRenumber(edited.base_value, v2);
      }
    });
    const control = selectedElement === void 0 ? void 0 : u$2("span", {
      class: "edit-controls",
      children: [
        renumbering,
        props.onCopy === void 0 ? void 0 : u$2(CopyElement, {
          name,
          from_side: side,
          onClick: () => props.onCopy(selectedElement)
        })
      ]
    });
    return control;
  }
  function HexRep(sig) {
    var value = sig.value;
    return value === void 0 ? u$2(b$1, {}) : u$2("span", {
      style: "font-family: monospace;",
      children: hexStr(value)
    });
  }
  function SongExplorer(props) {
    const song = props.pane.song.value;
    if (song === void 0) return u$2(b$1, {});
    const side = props.pane.side;
    const bump = props.pane.bumper.value;
    const phraseControl = u$2(EditControls, {
      name: "phrase",
      side: props.pane.side,
      selected: props.pane.selected_phrase,
      edited_number: props.pane.edited_phrase,
      onRenumber: (base_phrase, new_phrase) => {
        if (props.undoRedo.renumberPhrase(side, base_phrase, new_phrase)) {
          props.pane.selected_phrase.value = new_phrase;
          props.pane.bumper.value = bump + 1;
        }
      },
      onCopy: (phrase) => {
        props.undoRedo.copyPhrase(side, phrase);
        props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }
    });
    const chainControl = u$2(EditControls, {
      name: "chain",
      side: props.pane.side,
      selected: props.pane.selected_chain,
      edited_number: props.pane.edited_chain,
      onRenumber: (base_chain, new_chain) => {
        if (props.undoRedo.renumberChain(side, base_chain, new_chain)) {
          props.pane.selected_chain.value = new_chain;
          props.pane.bumper.value = bump + 1;
        }
      }
    });
    const tableControl = u$2(EditControls, {
      name: "Table",
      side: props.pane.side,
      selected: props.pane.selected_table,
      edited_number: props.pane.edited_table,
      canRenumber: (tbl) => tbl > 127,
      onRenumber: (base_table, new_table) => {
        if (props.undoRedo.renumberTable(side, base_table, new_table)) {
          props.pane.selected_table.value = new_table;
          props.pane.bumper.value = bump + 1;
        }
      },
      onCopy: (tbl) => {
        props.undoRedo.copyTable(side, tbl);
        props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }
    });
    const instrumentControl = u$2(EditControls, {
      name: "Instrument",
      side: props.pane.side,
      selected: props.pane.selected_instrument,
      edited_number: props.pane.edited_instrument,
      onRenumber: (base_instrument, new_instrument) => {
        if (props.undoRedo.renumberInstrument(side, base_instrument, new_instrument)) {
          props.pane.selected_instrument.value = new_instrument;
          props.pane.bumper.value = bump + 1;
        }
      },
      onCopy: (instr) => {
        props.undoRedo.copyInstrument(side, instr);
        props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }
    });
    const eqControls = u$2(EditControls, {
      name: "Eq",
      side: props.pane.side,
      selected: props.pane.selected_eq,
      edited_number: props.pane.edited_eq,
      onRenumber: (base_eq, new_eq) => {
        if (props.undoRedo.renumberEq(side, base_eq, new_eq)) {
          props.pane.selected_eq.value = new_eq;
          props.pane.bumper.value = bump + 1;
        }
      },
      onCopy: (eq) => {
        props.undoRedo.copyEq(side, eq);
        props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }
    });
    return u$2("div", {
      class: "rootcolumn",
      children: [
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: "Chains"
            }),
            u$2(ChainList, {
              bump: props.pane.bumper,
              song,
              selected_chain: props.pane.selected_chain,
              edited_chain: props.pane.edited_chain
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: "Phrases list"
            }),
            u$2(PhraseList, {
              bump: props.pane.bumper,
              song,
              selected_phrase: props.pane.selected_phrase,
              edited_phrase: props.pane.edited_phrase
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: "Intruments"
            }),
            u$2(InstrumentList, {
              side: props.pane.side,
              undoRedo: props.undoRedo,
              bump: props.pane.bumper,
              song,
              selected_instrument: props.pane.selected_instrument,
              edited_instrument: props.pane.edited_instrument,
              edited_instrument_name: props.pane.edited_instrument_name
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: "Tables"
            }),
            u$2(TableList, {
              bump: props.pane.bumper,
              song,
              selected_table: props.pane.selected_table,
              edited_table: props.pane.edited_table
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: "Eqs"
            }),
            u$2(EqList, {
              bump: props.pane.bumper,
              song,
              selected_eq: props.pane.selected_eq
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: u$2("div", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    class: "summary-title",
                    children: [
                      "Chain ",
                      HexRep(props.pane.selected_chain)
                    ]
                  }),
                  " ",
                  chainControl
                ]
              })
            }),
            u$2(ChainViewer, {
              panel: props.pane
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: u$2("div", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    class: "summary-title",
                    children: [
                      "Phrase ",
                      HexRep(props.pane.selected_phrase)
                    ]
                  }),
                  " ",
                  phraseControl
                ]
              })
            }),
            u$2(PhraseViewer, {
              panel: props.pane
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: u$2("div", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    class: "summary-title",
                    children: [
                      "Instrument ",
                      HexRep(props.pane.selected_instrument)
                    ]
                  }),
                  " ",
                  instrumentControl
                ]
              })
            }),
            u$2(InstrumentViewer, {
              panel: props.pane
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: u$2("div", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    class: "summary-title",
                    children: [
                      "Table ",
                      HexRep(props.pane.selected_table)
                    ]
                  }),
                  " ",
                  tableControl
                ]
              })
            }),
            u$2(TableViewer, {
              panel: props.pane
            })
          ]
        }),
        u$2("details", {
          class: "songsection",
          children: [
            u$2("summary", {
              children: u$2("div", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    class: "summary-title",
                    children: [
                      "Eq ",
                      HexRep(props.pane.selected_eq)
                    ]
                  }),
                  " ",
                  eqControls
                ]
              })
            }),
            u$2(EqViewer, {
              panel: props.pane,
              banner: props.banner
            })
          ]
        })
      ]
    });
  }
  function UndoButton(props) {
    return u$2("button", {
      type: "button",
      class: "modButton",
      title: "Undo operation and all after",
      onClick: () => props.undoredo.undoTo(props.idx),
      children: "\u21A9"
    });
  }
  function RefRender(props) {
    const side = UnicodeSideIcon(props.reference.side);
    return u$2("span", {
      class: "songref",
      children: [
        side,
        " ",
        props.reference.song_name
      ]
    });
  }
  function PatchKindRender(pk) {
    return pk;
  }
  function PatchRender(props) {
    const patch = props.patch;
    return u$2("li", {
      children: [
        PatchKindRender(patch.kind),
        " ",
        hexStr(patch.from_id),
        " -> ",
        hexStr(patch.to_id)
      ]
    });
  }
  function LogElement(props) {
    const elem = props.elem;
    const elem_class = props.disabled ? "logUndo disabledUndo" : "logUndo";
    switch (elem.kind) {
      case "error":
        return u$2("div", {
          class: "logError",
          children: [
            "\u{1F6AB} ",
            u$2(RefRender, {
              reference: elem.ref
            }),
            elem.message
          ]
        });
      case "rename":
        return u$2("div", {
          class: elem_class + " summary-root",
          title: `Renamed instrument ${hexStr(elem.instr)}`,
          children: [
            u$2("span", {
              class: "icon",
              children: "\u{1F3F7}"
            }),
            u$2(RefRender, {
              reference: elem.ref
            }),
            u$2("span", {
              children: [
                "instrument ",
                hexStr(elem.instr),
                ":",
                elem.old_name,
                " -> ",
                elem.new_name
              ]
            }),
            u$2(UndoButton, {
              idx: props.idx,
              log: elem,
              undoredo: props.undoredo
            })
          ]
        });
      case "move":
        const elems = elem.patch.map((pe) => u$2(PatchRender, {
          patch: pe
        }));
        return u$2("div", {
          class: elem_class,
          title: "Moved elements",
          children: u$2("details", {
            children: [
              u$2("summary", {
                class: "summary-root",
                children: [
                  u$2("span", {
                    children: [
                      u$2(RefRender, {
                        reference: elem.from_ref
                      }),
                      " -> ",
                      u$2(RefRender, {
                        reference: elem.to_ref
                      })
                    ]
                  }),
                  u$2("span", {
                    class: "edit-controls",
                    children: u$2(UndoButton, {
                      idx: props.idx,
                      log: elem,
                      undoredo: props.undoredo
                    })
                  })
                ]
              }),
              u$2("ul", {
                children: elems
              })
            ]
          })
        });
      case "renumber":
        return u$2("div", {
          class: elem_class + " summary-root",
          children: [
            "# ",
            u$2(RefRender, {
              reference: elem.ref
            }),
            " ",
            PatchKindRender(elem.elemKind),
            ":",
            hexStr(elem.old_value),
            " -> ",
            hexStr(elem.new_value),
            u$2(UndoButton, {
              idx: props.idx,
              log: elem,
              undoredo: props.undoredo
            })
          ]
        });
    }
  }
  function UndoRedoLog(props) {
    const log = props.log.value;
    const log_pointer = props.undo_level.value;
    return u$2("div", {
      class: "undoredobox",
      children: log.map((el, i2) => u$2(LogElement, {
        idx: i2,
        disabled: i2 >= log_pointer,
        elem: el,
        undoredo: props.undoredo
      }))
    });
  }
  function App() {
    const undoRedo = new UndoRedoer(state);
    const leftView = state.left.active_view.value === "song" ? u$2("div", {
      class: "rootcontent",
      children: [
        u$2(SongExplorer, {
          pane: state.left,
          undoRedo,
          other_pane: state.right,
          banner: state.message_banner
        }),
        u$2(SongViewer, {
          panel: state.left,
          undoRedo
        })
      ]
    }) : u$2(SpectraView, {
      panel: state.left,
      banner: state.message_banner
    });
    const rightView = state.right.active_view.value === "song" ? u$2("div", {
      class: "rootcontent",
      children: [
        u$2(SongViewer, {
          panel: state.right,
          undoRedo
        }),
        u$2(SongExplorer, {
          pane: state.right,
          undoRedo,
          other_pane: state.left,
          banner: state.message_banner
        })
      ]
    }) : u$2(SpectraView, {
      panel: state.right,
      banner: state.message_banner
    });
    return u$2(b$1, {
      children: [
        u$2("div", {
          class: "selection-rect"
        }),
        u$2("div", {
          class: "header",
          children: [
            u$2("div", {
              children: [
                u$2("h1", {
                  children: [
                    "Re",
                    u$2("pre", {
                      class: "titlepre",
                      children: "M8"
                    }),
                    "xer"
                  ]
                }),
                u$2("span", {
                  children: "v0.6"
                })
              ]
            }),
            u$2(UndoRedoLog, {
              log: state.remap_log,
              undo_level: state.undo_stack_pointer,
              undoredo: undoRedo
            })
          ]
        }),
        u$2("div", {
          class: "rootcontainer",
          children: [
            u$2("div", {
              class: "rootheader",
              children: [
                u$2(SongHeader, {
                  panel: state.left
                }),
                leftView
              ]
            }),
            u$2("div", {
              class: "rootheader",
              children: [
                u$2(SongHeader, {
                  panel: state.right
                }),
                rightView
              ]
            })
          ]
        })
      ]
    });
  }
  B$1(u$2(GlobalState.Provider, {
    value: state,
    children: u$2(App, {})
  }), document.body);
})();
