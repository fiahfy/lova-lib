import React, {Component} from 'react'

export default class About extends Component {
  componentDidMount() {
    const mail = 'd.fiahfy@gmail.com'
    $('.mail').attr('href', mail).text(mail)
  }
  render() {
    /*eslint-disable no-irregular-whitespace */
    return (
      <div className="container" id="about">
        <div className="page-header">
          <h2>About</h2>
        </div>
<pre>{`
　　　　　　　　　　 ｒ　〃　　　　　 ｀　丶 、
　　　/|　　　　　イ 　　　　　　　　　　 　　 　ヽ　　　 　|＼
　　/　l　　　 〃.　　　　　　　　　　　 　 　 　 　ヽ　　　|　　ヽ
　 ｒ　 　ヽ　〃/　.r　　　　　　　　　　　　 　　 　 ヽ　 /　　 　ヽ
　.|　　　　ハイ　|　 八　i　　 |＼　　 　 　　 丶 人_/　　　　　 ヽ
　|　∧ﾊ /ハ/|｜　|　l　 |　　|　 |　i　 i.　丶　 | 　 |　 ∧∧∧　|
　|/　　　　|　 |｜　|⌒|　|　|　|　 |　|　 | 　 |　 |∧∧/　　　　 |/　 　サキュバスです　！
　　　　　　|　 |　|　| 　 |　|　 | |　 V | 　| 　 |　|　 ｜　／⌒ヽ　　　 　淫乱なこと以外
　　　　　　|　 |　|V　 　＼|＼N　 　 ＼八ノ| ｜ 　 l／　　　 |　　　　何も　知りません　！
　　　　　　|　| Vr=＝＝=､　 　　 ,=＝＝=ｭ|/|　 ／ 　　　　/
　　　　　　|　|　 |::::::::　　　　 _　　　 　 ::::::::|ノ／ 　　　　 ／　　　　　　仲良くサイトを使いましょう！
　　　　　　|　| 　|　 　　　 _＿＿__　　 　　 ﾚ　 　　　　／
　　　　　　|　|　　ヽ　　　| 　　 　　|　 　 ／＼　　　／　
　　　　　　|　|　 |　 ＼　 ヽ_　　 _ノ　 ／　　　＼.イ
　　　　　　|　|　 |　　　＞　　＿　, イ　　　　　／　|
　　　　　　|　|　 |　 ／　/　　　　　く 　　 　／　　 |
`}</pre>
        <address>
          <strong>Mail</strong><br />
          <a className="mail" /><br />
          <strong>Issue</strong><br />
          <a href="https://github.com/fiahfy/lova-tool/issues">https://github.com/fiahfy/lova-tool/issues</a>
        </address>
      </div>
    )
    /*eslint-enable no-irregular-whitespace */
  }
}
