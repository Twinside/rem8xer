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
  var n, l$3, u$3, t$2, i$2, o$2, r$1, f$3, e$2, c$2, s$3, a$2, h$1 = {}, v$2 = [], p$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y$1 = Array.isArray;
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
    for (n2.__k = [], t2 = 0; t2 < e2; t2++) null != (i2 = l2[t2]) && "boolean" != typeof i2 && "function" != typeof i2 ? (r2 = t2 + a2, (i2 = n2.__k[t2] = "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$1(null, i2, null, null, null) : y$1(i2) ? g$1(b$1, {
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
  function A(n2, l2, u2, t2, i2) {
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
      h2.state = h2.__s, null != h2.getChildContext && (i2 = d$3(d$3({}, i2), h2.getChildContext())), x2 && !v2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(p2, w2)), P(n2, y$1(L2 = null != a2 && a2.type === b$1 && null == a2.key ? a2.props.children : a2) ? L2 : [
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
        A(u2, a2, null, _2, r2);
      }
      for (a2 in k2) _2 = k2[a2], "children" == a2 ? d2 = _2 : "dangerouslySetInnerHTML" == a2 ? v2 = _2 : "value" == a2 ? g2 = _2 : "checked" == a2 ? m2 = _2 : c2 && "function" != typeof _2 || b2[a2] === _2 || A(u2, a2, _2, b2[a2], r2);
      if (v2) c2 || p2 && (v2.__html === p2.__html || v2.__html === u2.innerHTML) || (u2.innerHTML = v2.__html), t2.__k = [];
      else if (p2 && (u2.innerHTML = ""), P(u2, y$1(d2) ? d2 : [
        d2
      ], t2, i2, o2, "foreignObject" === C2 ? "http://www.w3.org/1999/xhtml" : r2, f2, e2, f2 ? f2[0] : i2.__k && x$1(i2, 0), c2, s2), null != f2) for (a2 = f2.length; a2--; ) w$2(f2[a2]);
      c2 || (a2 = "value", "progress" === C2 && null == g2 ? u2.removeAttribute("value") : void 0 !== g2 && (g2 !== u2[a2] || "progress" === C2 && !g2 || "option" === C2 && g2 !== b2[a2]) && A(u2, a2, g2, b2[a2], r2), a2 = "checked", void 0 !== m2 && m2 !== u2[a2] && A(u2, a2, m2, b2[a2], r2));
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
  const __vite__wasmUrl = "" + new URL("m8_files_bg-Ireki0Bu.wasm", import.meta.url).href;
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
  function init$1() {
    wasm$1.init();
  }
  function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
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
  function takeFromExternrefTable0(idx) {
    const value = wasm$1.__wbindgen_export_0.get(idx);
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
  function copy_chain$1(from, to, chain, x2, y2) {
    let deferred2_0;
    let deferred2_1;
    try {
      _assertClass(from, WasmSong);
      _assertClass(to, WasmSong);
      const ret = wasm$1.copy_chain(from.__wbg_ptr, to.__wbg_ptr, chain, x2, y2);
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
  function addToExternrefTable0(obj) {
    const idx = wasm$1.__externref_table_alloc();
    wasm$1.__wbindgen_export_0.set(idx, obj);
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
  let cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
    }
    return cachedDataViewMemory0;
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
  function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  }
  function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
  }
  function __wbg_new_034f913e7636e987() {
    const ret = new Array();
    return ret;
  }
  function __wbg_new_e69b5f66fda8f13c() {
    const ret = new Object();
    return ret;
  }
  function __wbg_push_36cf4d81d7da33d1(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
  }
  function __wbg_buffer_ccaed51a635d8a2d(arg0) {
    const ret = arg0.buffer;
    return ret;
  }
  function __wbg_newwithbyteoffsetandlength_7e3eb787208af730(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  }
  function __wbg_new_fec2611eb9180f95(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  }
  function __wbg_set_ec2fcf81bc573fd9(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  }
  function __wbg_length_9254c4bd3b9f23c4(arg0) {
    const ret = arg0.length;
    return ret;
  }
  function __wbg_newwithlength_76462a666eca145f(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
  }
  function __wbg_setindex_ffcb66ea02efa3aa(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
  }
  function __wbg_set_e864d25d9b399c9f() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = Reflect.set(arg0, arg1, arg2);
      return ret;
    }, arguments);
  }
  function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return ret;
  }
  function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  }
  function __wbg_error_f851667af71bcfc6(arg0, arg1) {
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
  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  }
  function __wbindgen_memory() {
    const ret = wasm$1.memory;
    return ret;
  }
  function __wbindgen_init_externref_table() {
    const table = wasm$1.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, void 0);
    table.set(offset + 0, void 0);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  }
  URL = globalThis.URL;
  const __vite__wasmModule = await __vite__initWasm({
    "./m8_files_bg.js": {
      __wbindgen_string_new,
      __wbindgen_number_new,
      __wbg_new_034f913e7636e987,
      __wbg_new_e69b5f66fda8f13c,
      __wbg_push_36cf4d81d7da33d1,
      __wbg_buffer_ccaed51a635d8a2d,
      __wbg_newwithbyteoffsetandlength_7e3eb787208af730,
      __wbg_new_fec2611eb9180f95,
      __wbg_set_ec2fcf81bc573fd9,
      __wbg_length_9254c4bd3b9f23c4,
      __wbg_newwithlength_76462a666eca145f,
      __wbg_setindex_ffcb66ea02efa3aa,
      __wbg_set_e864d25d9b399c9f,
      __wbg_new_abda76e883ba8a5f,
      __wbg_stack_658279fe44541cf6,
      __wbg_error_f851667af71bcfc6,
      __wbindgen_throw,
      __wbindgen_memory,
      __wbindgen_init_externref_table
    }
  }, __vite__wasmUrl);
  const memory = __vite__wasmModule.memory;
  const init = __vite__wasmModule.init;
  const __wbg_wasmsong_free = __vite__wasmModule.__wbg_wasmsong_free;
  const song_name = __vite__wasmModule.song_name;
  const write_song = __vite__wasmModule.write_song;
  const load_song = __vite__wasmModule.load_song;
  const get_song_steps = __vite__wasmModule.get_song_steps;
  const get_chain_steps = __vite__wasmModule.get_chain_steps;
  const show_phrase = __vite__wasmModule.show_phrase;
  const show_table = __vite__wasmModule.show_table;
  const rename_instrument = __vite__wasmModule.rename_instrument;
  const renumber_table = __vite__wasmModule.renumber_table;
  const renumber_instrument = __vite__wasmModule.renumber_instrument;
  const renumber_chain = __vite__wasmModule.renumber_chain;
  const renumber_phrase = __vite__wasmModule.renumber_phrase;
  const copy_chain = __vite__wasmModule.copy_chain;
  const instrument_name = __vite__wasmModule.instrument_name;
  const allocated_instrument_list = __vite__wasmModule.allocated_instrument_list;
  const allocated_phrase_list = __vite__wasmModule.allocated_phrase_list;
  const allocated_chain_list = __vite__wasmModule.allocated_chain_list;
  const allocated_table = __vite__wasmModule.allocated_table;
  const describe_instrument = __vite__wasmModule.describe_instrument;
  const __wbindgen_export_0 = __vite__wasmModule.__wbindgen_export_0;
  const __wbindgen_free = __vite__wasmModule.__wbindgen_free;
  const __externref_table_dealloc = __vite__wasmModule.__externref_table_dealloc;
  const __wbindgen_malloc = __vite__wasmModule.__wbindgen_malloc;
  const __wbindgen_realloc = __vite__wasmModule.__wbindgen_realloc;
  const __wbindgen_exn_store = __vite__wasmModule.__wbindgen_exn_store;
  const __externref_table_alloc = __vite__wasmModule.__externref_table_alloc;
  const __wbindgen_start = __vite__wasmModule.__wbindgen_start;
  const wasm = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_table_alloc,
    __externref_table_dealloc,
    __wbg_wasmsong_free,
    __wbindgen_exn_store,
    __wbindgen_export_0,
    __wbindgen_free,
    __wbindgen_malloc,
    __wbindgen_realloc,
    __wbindgen_start,
    allocated_chain_list,
    allocated_instrument_list,
    allocated_phrase_list,
    allocated_table,
    copy_chain,
    describe_instrument,
    get_chain_steps,
    get_song_steps,
    init,
    instrument_name,
    load_song,
    memory,
    rename_instrument,
    renumber_chain,
    renumber_instrument,
    renumber_phrase,
    renumber_table,
    show_phrase,
    show_table,
    song_name,
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
  const EmptyChainEdition = {
    x: -1,
    y: -1,
    base_chain: -1,
    current_value: -1
  };
  const EmptyPhraseEdition = {
    base_phrase: -1,
    current_value: -1
  };
  const EmptyInstrumentNameEdition = {
    instrument_id: -1,
    name: ""
  };
  const EmptyInstrumentNumberEidition = {
    base_instrument: -1,
    current_value: -1
  };
  function initPane() {
    return {
      loaded_name: d$1(void 0),
      song: d$1(void 0),
      bumper: d$1(0),
      edited_chain: d$1(void 0),
      edited_phrase: d$1(void 0),
      edited_instrument: d$1(void 0),
      edited_instrument_name: d$1(void 0),
      edited_table: d$1(void 0),
      raw_song: d$1(new Uint8Array(0)),
      selected_chain: d$1(void 0),
      selected_phrase: d$1(void 0),
      selection_range: d$1(void 0),
      selected_table: d$1(void 0),
      selected_instrument: d$1(void 0)
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
      left: initPane(),
      right: initPane(),
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
    const state2 = x(GlobalState);
    const current_edit_name = props.edited_instrument_name.value;
    const edited_name = current_edit_name || EmptyInstrumentNameEdition;
    const current_edit = props.edited_instrument.value;
    const edited_instr = current_edit || EmptyInstrumentNumberEidition;
    const allow_new_edit = current_edit_name === void 0 && current_edit === void 0;
    const bump = props.bump.value;
    for (const vix of instruments) {
      const real_name = instrument_name$1(props.song, vix);
      let name = real_name === "" ? "\xA0\xA0\xA0\xA0" : real_name;
      const toggle_instr = () => props.edited_instrument.value = {
        base_instrument: vix,
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
        try {
          renumber_instrument$1(props.song, edited_instr.base_instrument, v2);
          props.bump.value = bump + 1;
        } catch (err) {
          state2.message_banner.value = err.toString();
        }
      };
      const name_change = (name2) => {
        props.edited_instrument_name.value = {
          ...edited_name,
          name: name2
        };
      };
      const name_validate = (name2) => {
        props.edited_instrument_name.value = void 0;
        try {
          rename_instrument$1(props.song, edited_name.instrument_id, name2);
          props.bump.value = bump + 1;
        } catch (err) {
          state2.message_banner.value = err.toString();
        }
      };
      elems.push(u$2("div", {
        class: "instr",
        children: [
          edited_instr.base_instrument === vix ? u$2(HexNumberEditor, {
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
  const emptyUrl = "" + new URL("V4EMPTY-BJSP-h73.m8s", import.meta.url).href;
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
    const steps = props.steps;
    props.pane.bumper.value;
    let read_cursor = 0;
    const dragStart = (evt, chain) => {
      const asJson = {
        chain,
        from_song: props.side
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
      try {
        const asJson = JSON.parse(strPayload);
        if (!isDraggedChain(asJson)) return;
        if (asJson.from_song === props.side) {
          state2.message_banner.value = "We avoid copying a chain into the same song";
        } else if (asJson.from_song === "left") {
          copy_chain$1(state2.left.song.value, state2.right.song.value, asJson.chain, col, line);
        } else {
          copy_chain$1(state2.right.song.value, state2.left.song.value, asJson.chain, col, line);
        }
        pane.bumper.value = pane.bumper.value + 1;
      } catch (err) {
        state2.message_banner.value = `Chain copy error: ${err}`;
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
              renumber_chain$1(pane.song.value, edition.base_chain, value);
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
              base_chain: chain
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
  function SongViewer(props) {
    const state2 = x(GlobalState);
    const panel = props.panel;
    const filename = panel.loaded_name.value;
    const song = panel.song.value;
    panel.bumper.value;
    const songName = song !== void 0 ? song_name$1(song) : filename;
    if (song === void 0) {
      const debugLoad = void 0;
      return u$2("div", {
        class: "rootcolumn",
        children: [
          u$2("button", {
            onClick: () => loadUrl(state2, panel, emptyUrl),
            children: "Load empty song"
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
    const steps = u$2(StepsRender, {
      side: props.side,
      steps: get_song_steps$1(song),
      pane: props.panel
    });
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
    return u$2("div", {
      class: "rootcolumn",
      children: [
        u$2("div", {
          children: [
            u$2("h3", {
              style: "display: inline-block;",
              children: songName
            }),
            u$2("span", {
              class: "separator"
            }),
            song !== void 0 ? u$2("button", {
              onClick: save,
              children: "Save"
            }) : void 0,
            song !== void 0 ? u$2("button", {
              onClick: clear,
              children: "Clear"
            }) : void 0
          ]
        }),
        u$2("div", {
          class: "songsteps-wrapper",
          children: steps
        })
      ]
    });
  }
  function PhraseList(props) {
    const phrases = allocated_phrase_list$1(props.song);
    const elems = [];
    const state2 = x(GlobalState);
    const current_edit = props.edited_phrase.value;
    const edited_phrase = current_edit || EmptyPhraseEdition;
    const allow_new_edit = current_edit === void 0;
    const bump = props.bump.value;
    let bucket = [];
    let prevPhrase = phrases.length > 0 ? phrases[0] : 0;
    for (const vix of phrases) {
      const toggle_phrase = () => props.edited_phrase.value = {
        base_phrase: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_phrase.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_phrase.value = void 0;
        try {
          renumber_phrase$1(props.song, edited_phrase.base_phrase, v2);
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
      bucket.push(edited_phrase.base_phrase === vix ? u$2(HexNumberEditor, {
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
        base_chain: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_chain.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_chain.value = void 0;
        try {
          renumber_chain$1(props.song, edited_chain.base_chain, v2);
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
      bucket.push(edited_chain.base_chain === vix ? u$2(HexNumberEditor, {
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
    const edited_phrase = current_edit || EmptyPhraseEdition;
    const allow_new_edit = current_edit === void 0;
    const bump = props.bump.value;
    let bucket = [];
    let prevPhrase = phrases.length > 0 ? phrases[0] : 0;
    for (const vix of phrases) {
      const toggle_table = () => props.edited_table.value = {
        base_phrase: vix,
        current_value: vix
      };
      const id_change = (v2) => props.edited_table.value = {
        ...current_edit,
        current_value: v2
      };
      const id_validate = (v2) => {
        props.edited_table.value = void 0;
        try {
          renumber_table$1(props.song, edited_phrase.base_phrase, v2);
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
      bucket.push(edited_phrase.base_phrase === vix ? u$2(HexNumberEditor, {
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
                  eq === 255 ? "--" : hexStr(eq)
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
  init$1();
  const state = initState();
  function MessageBanner() {
    const msg = state.message_banner.value;
    if (msg === void 0) return u$2(b$1, {});
    return u$2("div", {
      children: msg
    });
  }
  function SongExplorer(props) {
    const song = props.pane.song.value;
    if (song === void 0) return u$2(b$1, {});
    const selectedPhrase = props.pane.selected_phrase.value;
    const displayedPhrase = selectedPhrase === void 0 ? "" : " " + hexStr(selectedPhrase);
    const selectedChain = props.pane.selected_chain.value;
    const displayedChain = selectedChain === void 0 ? "" : " " + hexStr(selectedChain);
    const selectedTable = props.pane.selected_table.value;
    const displayedTable = selectedTable === void 0 ? "" : " " + hexStr(selectedTable);
    const selectedInstrument = props.pane.selected_instrument.value;
    const displayedInstrument = selectedInstrument === void 0 ? "" : " " + hexStr(selectedInstrument);
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
              children: [
                "Chain",
                displayedChain
              ]
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
              children: [
                "Phrase",
                displayedPhrase
              ]
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
              children: [
                "Instrument",
                displayedInstrument
              ]
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
              children: [
                "Table",
                displayedTable
              ]
            }),
            u$2(TableViewer, {
              panel: props.pane
            })
          ]
        })
      ]
    });
  }
  function App() {
    return u$2(b$1, {
      children: [
        u$2("div", {
          class: "selection-rect"
        }),
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
              children: "v0.3"
            })
          ]
        }),
        u$2(MessageBanner, {}),
        u$2("div", {
          class: "rootcontainer",
          children: [
            u$2(SongExplorer, {
              pane: state.left
            }),
            u$2(SongViewer, {
              side: "left",
              panel: state.left
            }),
            u$2(SongViewer, {
              side: "right",
              panel: state.right
            }),
            u$2(SongExplorer, {
              pane: state.right
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
