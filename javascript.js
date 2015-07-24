<script type="text/javascript">
window.onload = prolog;
var numChoice = 2;			// 選択肢数
var numConversation = 3;	// 会話数
var playerName = "";	// プレイヤーの名前
// テキストボックス反映用変数
var skitBox, choice1Box, choice2Box, choice3Box;
var backlogBox;
// バックログの内容
var backlogText = "";;
// プロローグのメッセージ送りをするための変数
var timer;
var prologSkitNumber = 0;
// 会話データ格納用変数(skit:会話内容、c1～c3:選択肢)
var skit = new Array(numChoice + 2);
var conversationData;	// 会話データ(csv形式)
// 選択した選択肢を記録する配列
var skitData = new Array(numConversation);
var skitNumber;			// 現在の会話の番号

function init() {
	skitNumber = 0;	// 会話番号を0で初期化
	
	// 選んだ会話をリセット
	for (var i = 0; i < numConversation; i++) {
		skitData[i] = 0;
	}
	
	// csvファイル読み込み
	conversationData = getConversationData("text.csv");
	
	// 選んだ会話をリセット
	for (var i = 0; i < numConversation; i++) {
		skitData[i] = 0;
	}
	
	// 最初の会話データを読み込む
	for (var i = 0; i < numChoice + 1; i++) {
		skit[i] = conversationData[0][i]
	}
	
	// バックログに最初の会話を追加
	backlogText += skit[0] + "\n";
	
	// テキストボックスに内容を反映
	skitBox.value = skit[0];
	choice1Box.value = skit[1];
	choice2Box.value = skit[2];
	backlogBox.value = backlogText;
	
	// 最初のキャラクターの顔画像を表示
	document.face.src = "image/face" + conversationData[0][numChoice + 1] +".png";
}

// csvファイルのデータをを二次元配列に格納する関数(
function csv2Array(filePath) { //csvファイルの相対パスor絶対パス
	var csvData = new Array();
	var data = new XMLHttpRequest();	
	data.open("GET", filePath, false); //true:非同期,false:同期
	data.send(null);

	var LF = "\n"; //改行コード
	var lines = data.responseText.split(LF);
	for (var i = 0; i < lines.length; i++) {
		var cells = lines[i].split(",");
		if( cells.length != 1 ) {
			csvData.push(cells);
		}
	}
	return csvData;
}

// 格納した二次元配列を会話データに変換
function getConversationData(filePath) { //csvファイルの相対パスor絶対パス
	var csvData = csv2Array(filePath);
	
	// 会話データを読み込む
	for (var i = 0; i < csvData.length; i++) {
		for (var j = 0; j < csvData[i].length; j++) {
			var skit = "";
			for (var k = 0; k < csvData[i][j].length; k++) {
				if (csvData[i][j].charAt(k) == "*") {	// データ中に*があれば
					skit += playerName;	// プレイヤーの名前に変換
				}
				else {
					skit += csvData[i][j].charAt(k);
				}
			}
			csvData[i][j] = skit;
		}
	}
	return csvData;
}

// プロローグ用関数
function prolog() {
	if (prologSkitNumber == 0) {
		document.face.src = "image/face1.png";
		
		do {
			playerName = prompt("あなたの名前を入力してください", "name");
		} while (playerName == "" || playerName == null);

		// バックログのデータを初期化
		backlogText = "";

		// テキストボックスに反映するための準備
		skitBox = document.text.skit;
		choice1Box = document.text.choice1;
		choice2Box = document.text.choice2;
		backlogBox = document.text.backlog;
	}
	choice1Box.value = "";
	choice2Box.value = "";
	
	switch (prologSkitNumber) {
	case 0:
		skitBox.value = "今日は天気が良かったのでペットのペチを散歩に連れ出した。";
		backlogText += skitBox.value + "\n";
		backlogBox.value = backlogText;
		break;
	case 1:
		skitBox.value = "ペチも嬉しそうに散歩を楽しんでいるようだ。";
		backlogText += skitBox.value + "\n";
		backlogBox.value = backlogText;
		break;
	case 2:
		skitBox.value = "そろそろ帰ろうかと思ったそのとき…。";
		backlogText += skitBox.value + "\n";
		backlogBox.value = backlogText;
		break;
	}
	prologSkitNumber++;
	
	if (prologSkitNumber > 3) {
		init();
		return;
	}
	
	// 1.5秒でメッセージを送る
	timer = setTimeout("prolog()", 1500);
}

// 選択肢を選んだときの処理の関数
function answer(ans) {
	if (prologSkitNumber < 3 || skitNumber >= numConversation) {
		return;
	}
	
	// 今までの答えから次の会話と選択肢を設定
	var temp = 0;
	for (var i = 0; i < skitNumber; i++) {
		temp += skitData[i] * power(numChoice, skitNumber - i);
	}
	temp += ans;
	
	// 会話がまだ残っていれば次へ
	if (skitNumber < numConversation - 1) {
		
		// こちら対応をバックログに追加して表示
		backlogText += playerName + "：" + skit[ans] + "\n";
		backlogBox.value = backlogText;
	
		// 会話データを読み込み
		for (var i = 0; i < numChoice + 1; i++) {
			skit[i] = conversationData[temp][i];
		}
		
		skitData[skitNumber] = ans;	// 選んだ答えをこれまでの会話の内容に追加
		
		// 顔画像を更新(conversationData[n][numChoice + 1]は顔画像の番号)
		document.face.src = "image/face" + conversationData[temp][numChoice + 1] + ".png";
	}
	else {
		// こちら対応をバックログに追加して表示
		backlogText += playerName + "：" + skit[ans] + "\n";
		backlogBox.value = backlogText;
		
		// 会話終了
		skit[0] = conversationData[temp][0];
		skit[1] = "会話は終了です";
		skit[2] = "";
		
		// 顔画像を更新(次の選択肢はないが、最後の顔画像を表示する)
		document.face.src = "image/face" + conversationData[temp][numChoice + 1] + ".png";
	}
	skitNumber++;	// 会話番号を増加
		
	// 会話データをテキストボックスに反映
	skitBox.value = skit[0];
	choice1Box.value = skit[1];
	choice2Box.value = skit[2];
	// 次に表示される会話をバックログに追加して表示
	backlogText += skit[0] + "\n";
	backlogBox.value = backlogText;
}

// aのr乗を求める関数
function power(a, r) {
	var num = 1;
	for (var i = 0; i < r; i++) {
		num *= a;
	}
	return num;
}

function reset() {
	if (prologSkitNumber >= 3) {
		if (skitNumber > 0 && skitNumber < numConversation) {
			// 会話が途中の場合、確認ダイアログの表示
			if (window.confirm('会話の途中ですがリセットしますか？')) {
			prologSkitNumber = 0;
				prolog();
			}
		}
		else {
			prologSkitNumber = 0;
			prolog();
		}
	}
}
</script>
