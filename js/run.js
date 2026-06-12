let pyodideEnv;

// 初始化Python环境
async function initPyodide() {
    pyodideEnv = await loadPyodide();
    // 加载数据分析常用库
    await pyodideEnv.loadPackage(["pandas", "numpy"]);
}

// 运行代码函数
async function runCode(editId, outId) {
    const codeText = document.getElementById(editId).value;
    const outDom = document.getElementById(outId);
    outDom.innerText = "运行中，请稍等...";

    try {
        // 重定向标准输出
        pyodideEnv.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        // 执行代码
        await pyodideEnv.runPythonAsync(codeText);
        // 获取输出结果
        const result = pyodideEnv.runPython("sys.stdout.getvalue()");
        outDom.innerText = result || "执行完成，无输出内容";
    } catch (err) {
        outDom.innerText = "运行报错：\n" + err.message;
    }
}

// 页面加载完成自动初始化环境
window.onload = initPyodide;