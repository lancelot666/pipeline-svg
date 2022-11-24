import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './style.module.scss';
import cn from 'classnames';
/* api参考文档: https://anseki.github.io/leader-line/ */
/* eslint no-unused-vars:0 */
const defaultOptions = {
    lineStyle: {
        color: '#2C7AFF', // '#C3CAD5',
        size: '2',
    },
    iconStyle: {
        bgc: {
            success: '#3AC27D',
            fail: '#FF553D',
            init: '#BBC3CF',
            running: '#5488EF',
            end: '#898888',
            ban: '#BBC3CF',
        },  
        color: '#fff',
    },
    titleStyle: {
        fontWeight: 500,
    },
};
let isActive = false;

class PipeLine extends Component {
    static propTypes = {
        lineTitle: PropTypes.array,
        lineStyle: PropTypes.object,
        lineData: PropTypes.array,
    };
    static defaultProps = {
        lineTitle: [],
        lineStyle: {},
        lineData: [],
    };
    // constructor(props) {
    //     super(props);
    //     this.state = {

    //     }
    //     console.log('pipeline',this.props)
    // }
    getNumber(color) {
        return color.charAt(0) === '#' ? color.substring(1, 7) : color;
    }
    getR(color) {
        return parseInt(this.getNumber(color).substring(0, 2), 16);
    }

    getG(color) {
        return parseInt(this.getNumber(color).substring(2, 4), 16);
    }
    getB(color) {
        return parseInt(this.getNumber(color).substring(4, 6), 16);
    }
    getRGB(color) {
        if (color.charAt(0) === '#') {
            return [
                parseInt(this.getNumber(color).substring(0, 2), 16),
                parseInt(this.getNumber(color).substring(2, 4), 16),
                parseInt(this.getNumber(color).substring(4, 6), 16),
            ];
        }
        const bg = color.match(
            /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/
        );
        return [Number(bg[1]), Number(bg[2]), Number(bg[3])];
    }
    componentDidMount() {
        this.setSVGDiv();
        this.dataMap();
    }

    // 渲染标题头
    renderTitle(lineTitle) {
        if (!lineTitle) return null;
        return (
            <div className={s.pipeTitle}>
                {lineTitle.map((v, i) => {
                    return (
                        <div title={v.title} className={s.titleItem} key={i}>
                            {typeof v.title === 'string' ? (
                                <div className={s.titleText}>
                                    <span>{v.title}</span>
                                    <span className={s.titleIcon}>{v.icon}</span>
                                </div>
                            ) : (
                                <div className={s.titleText}>{v.title()}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }
    // 渲染内容
    rendetContext(lineData) {
        const { lineStyle } = this.props;
        const style = lineStyle?.color || defaultOptions.lineStyle;
        if (!lineData) return null;
        return (
            <div className={s.pipeContext}>
                {lineData.map((v, i) => {
                    // 遍历group
                    if (v.group) {
                        return (
                            <div
                                key={i}
                                className={cn(s.groupItem, v.groupClass)}
                                style={v.groupStyle}
                            >
                                {v.group.map((g, gi) => {
                                    return (
                                        <div
                                            className={cn(s.groupOne)}
                                            key={gi}
                                            // onClick={() => (v.callback ? g.callback(g) : null)}
                                        >
                                            <div id={g.key} className={s.singleOne}>
                                                {/* group子项容器左侧引导线 */}
                                                <div className={s.itemLink}>
                                                    <span
                                                        id={`left${g.key}`}
                                                        className={
                                                            i === 0 ? '' : cn(s.link, s.linkLeft)
                                                        }
                                                        style={{
                                                            border: `${i === 0 ? 0 : 1}px solid ${
                                                                style.color
                                                            }`,
                                                        }}
                                                        // style={ i === 0 ? {} : {
                                                        //     border: `1px ${g.status !== 'success' ? 'dashed' : 'solid'} ${style.color}`
                                                        // }}
                                                    ></span>
                                                </div>
                                                {/* group子项容器内容 */}
                                                <div
                                                    className={s.centerText}
                                                    onClick={() =>
                                                        g.callback ? g.callback(g) : null
                                                    }
                                                    onMouseMove={() => {
                                                        this.changeBg(g.key, 1);
                                                    }}
                                                    onMouseLeave={() => {
                                                        this.changeBg(g.key, 0);
                                                    }}
                                                >
                                                    <span
                                                        className={cn(s.leftIcon, g.iconClass)}
                                                        style={
                                                            g.iconStyle || {
                                                                backgroundColor:
                                                                    defaultOptions.iconStyle.bgc[
                                                                        g.status
                                                                    ],
                                                                color:
                                                                    defaultOptions.iconStyle.color,
                                                            }
                                                        }
                                                    >
                                                        {g.icon}
                                                    </span>
                                                    <span
                                                        className={cn(s.rightText, g.titleClass)}
                                                        style={g.titleStyle}
                                                    >
                                                        {g.title}
                                                    </span>
                                                </div>
                                                {/* group子项容器右侧引导线 */}
                                                <div className={s.itemLink}>
                                                    <span
                                                        id={`right${g.key}`}
                                                        className={
                                                            i === lineData.length - 1
                                                                ? ''
                                                                : cn(s.link, s.linkRight)
                                                        }
                                                        style={{
                                                            border: `${
                                                                i === lineData.length - 1 ? 0 : 1
                                                            }px solid ${style.color}`,
                                                        }}
                                                        // style={ i === lineData.length-1 ? {} : {
                                                        //     border: `1px ${g.status !== 'success' ? 'dashed' : 'solid'} ${style.color}`
                                                        // }}
                                                    ></span>
                                                </div>
                                            </div>
                                            {this.renderItem(g.item, g)}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                    // 遍历单项
                    return (
                        <div className={s.singleItem} key={i}>
                            <div id={v.key} className={s.singleOne}>
                                {/* 单项容器左侧引导线 */}
                                <div className={s.itemLink}>
                                    <span
                                        id={`left${v.key}`}
                                        className={i === 0 ? '' : cn(s.link, s.linkLeft)}
                                        style={{
                                            border: `${i === 0 ? 0 : 1}px solid ${style.color}`,
                                        }}
                                        // style={i=== 0 ? {} : {
                                        //     border: `1px ${v.status !== 'success' ? 'dashed' : 'solid'} ${style.color}`
                                        // }}
                                    ></span>
                                </div>
                                {/* 单项容器内容 */}
                                <div
                                    className={s.centerText}
                                    onClick={() => (v.callback ? v.callback(v) : null)}
                                    onMouseMove={() => {
                                        this.changeBg(v.key, 1);
                                    }}
                                    onMouseLeave={() => {
                                        this.changeBg(v.key, 0);
                                    }}
                                >
                                    <span
                                        className={cn(s.leftIcon, v.iconClass)}
                                        style={
                                            v.iconStyle || {
                                                backgroundColor:
                                                    defaultOptions.iconStyle.bgc[v.status],
                                                color: defaultOptions.iconStyle.color,
                                            }
                                        }
                                    >
                                        {v.icon}
                                    </span>
                                    <span
                                        className={cn(s.rightText, v.titleClass)}
                                        style={v.titleStyle || defaultOptions.titleStyle}
                                    >
                                        {v.title}
                                    </span>
                                </div>
                                {/* 单项容器右侧引导线 */}
                                <div className={s.itemLink}>
                                    <span
                                        id={`right${v.key}`}
                                        className={
                                            i === lineData.length - 1 ? '' : cn(s.link, s.linkRight)
                                        }
                                        style={{
                                            border: `${i === lineData.length - 1 ? 0 : 1}px solid ${
                                                style.color
                                            }`,
                                        }}
                                        // style={i=== lineData.length-1 ? {} : {
                                        //     border: `1px ${v.status !== 'success' ? 'dashed' : 'solid'} ${style.color}`
                                        // }}
                                    ></span>
                                </div>
                            </div>
                            {this.renderItem(v.item, v)}
                        </div>
                    );
                })}
            </div>
        );
    }
    // 渲染内容子项
    renderItem(item, parent) {
        if (!item) return null;
        return (
            <div
                className={s.singleSec}
                id={item.key}
                onClick={() => (parent.callback ? parent.callback(item) : null)}
            >
                <div className={s.itemLink}>
                    <span className={s.link2}></span>
                </div>
                <div className={s.centerText2}>
                    {typeof item.title === 'string' ? (
                        <>
                            <span className={s.leftIcon}>{item.icon}</span>
                            <span className={s.rightText}>{item.title}</span>
                        </>
                    ) : (
                        item.title()
                    )}
                </div>
                <div className={s.itemLink}>
                    <span className={s.link2}></span>
                </div>
            </div>
        );
    }
    // 遍历逻辑
    dataMap() {
        const { lineData } = this.props;
        if (!lineData.length) return null;
        for (let i = 0; i < lineData.length; i += 1) {
            if (i < lineData.length - 1) {
                // 单项渲染逻辑
                if (lineData[i].status) {
                    // 判断下一项是否为group
                    const next = lineData[i + 1];
                    // 下一项有status标识单项
                    if (next.status) {
                        this.renderLine(lineData[i], next);
                    } else {
                        // 标识group
                        for (let g = 0; g < next.group.length; g += 1) {
                            this.renderLine(lineData[i], next.group[g]);
                        }
                    }
                    continue;
                }
                // group选项逻辑
                for (let g = 0; g < lineData[i].group.length; g += 1) {
                    // 判断下一项是否为group
                    const next = lineData[i + 1];
                    // 下一项有status标识单项
                    if (next.status) {
                        this.renderLine(lineData[i].group[g], next, lineData[i].group);
                    } else {
                        // 标识group
                        for (let n = 0; n < next.group.length; n += 1) {
                            this.renderLine(lineData[i].group[g], next.group[n], lineData[i].group);
                        }
                    }
                }
            }
        }
        return true;
    }
    // 设置SVG容器宽高
    setSVGDiv() {
        // 设置svg容器
        const parent = document.getElementById('pipeCanvas').getBoundingClientRect();
        const target = document.getElementById('pipeSvg');
        target.style.width = parent.width;
        target.style.height = parent.height;
    }
    // 渲染线条
    renderLine(cur, next, curGroupArr = []) {
        const { lineStyle } = this.props;
        const style = lineStyle?.color || defaultOptions.lineStyle;
        console.log(cur,next)
        const target = document.getElementById('pipeSvg');
        const dom1 = document.getElementById(cur.key).childNodes[2].getBoundingClientRect();
        const dom2 = document.getElementById(next.key).childNodes[0].getBoundingClientRect();
        // 坐标轴原点是父容器的x,y坐标处
        const x1 = dom1.x - target.getBoundingClientRect().x + 30; // dom1.x+10;
        const y1 = dom1.y - target.getBoundingClientRect().y + 20; // dom1.y;
        const x2 = dom2.x - target.getBoundingClientRect().x; // dom2.x-20;
        const y2 = dom2.y - target.getBoundingClientRect().y + 20; // dom2.y;
        // const pass1 = cur.status === 'success';
        // const pass2 = next.status === 'success';
        const svgns = 'http://www.w3.org/2000/svg';
        // 生成折线
        const line = document.createElementNS(svgns, 'polyline');
        // 填充透明
        line.setAttributeNS(null, 'fill', `none`);
        line.setAttributeNS(null, 'stroke', style.color);
        line.setAttributeNS(null, 'stroke-width', style.size);
        // 失败状态为虚线
        // if(!pass1 || !pass2) {
        //     line.setAttributeNS(null, "stroke-dasharray", `4,4`);
        // }
        // 两者在同一水平线上，生成两段线
        if (dom1.y === dom2.y) {
            // 判断左侧容器状态
            const leftLine = document.createElementNS(svgns, 'polyline');
            leftLine.setAttributeNS(null, 'fill', `none`);
            leftLine.setAttributeNS(null, 'stroke', style.color);
            leftLine.setAttributeNS(null, 'stroke-width', style.size);
            // if(pass1) {
            //     leftLine.setAttributeNS(null, "stroke-dasharray", `none`);
            // } else {
            //     leftLine.setAttributeNS(null, "stroke-dasharray", `4,4`);
            // }
            leftLine.setAttributeNS(null, 'points', `${x1},${y1} ${(x2 - x1) / 2 + x1},${y2}`);
            // leftLine.setAttributeNS(null,'points', `${x1},${y1} ${(x2-x1)/2+x1},${y2}`);
            target.appendChild(leftLine);
            // 判断右侧容器状态
            const rightLine = document.createElementNS(svgns, 'polyline');
            rightLine.setAttributeNS(null, 'fill', `none`);
            rightLine.setAttributeNS(null, 'stroke', style.color);
            rightLine.setAttributeNS(null, 'stroke-width', style.size);
            // if(pass2) {
            //     rightLine.setAttributeNS(null, "stroke-dasharray", `none`);
            // } else {
            //     // 如果右侧状态为失败，判断左侧是否有group且group中是否有成功状态，符合条件则渲染为实线
            //     if(curGroupArr.length && curGroupArr.some(v=>v.status === 'success')) {
            //         rightLine.setAttributeNS(null, "stroke-dasharray", `none`);
            //         // 同时更新右侧容器的左引导线样式
            //         document.getElementById(`left${next.key}`).style.border = `1px solid ${style.color}`;
            //     } else {
            //         rightLine.setAttributeNS(null, "stroke-dasharray", `4,4`);
            //     }
            // }
            rightLine.setAttributeNS(null, 'points', `${(x2 - x1) / 2 + x1},${y2} ${x2},${y2}`);
            target.appendChild(rightLine);
            // 左侧为单项时且右侧为group时，绘制曲线
            if(!Object.prototype.hasOwnProperty.call(cur, 'rootKey') && Object.prototype.hasOwnProperty.call(next, 'rootKey')) {
                const leLine = document.createElementNS(svgns, 'path');
                leLine.setAttributeNS(null, 'fill', `none`);
                leLine.setAttributeNS(null, 'stroke', style.color);
                leLine.setAttributeNS(null, 'stroke-width', style.size);
                leLine.setAttributeNS(
                    null,
                    'd',
                    `M${x1} ${y1} C${x1} ${y1} ${(x2 - x1) /
                        2 +
                        x1} ${y2 + 5} ${(x2 - x1) /
                            2 +
                            x1},${y2 + 20}`
                );
                target.appendChild(leLine);
            }
            // 左侧为group时且右侧为单项时，绘制曲线
            if(Object.prototype.hasOwnProperty.call(cur, 'rootKey') && !Object.prototype.hasOwnProperty.call(next, 'rootKey')) {
                const riLine = document.createElementNS(svgns, 'path');
                riLine.setAttributeNS(null, 'fill', `none`);
                riLine.setAttributeNS(null, 'stroke', style.color);
                riLine.setAttributeNS(null, 'stroke-width', style.size);
                riLine.setAttributeNS(
                    null,
                    'd',
                    `M${(x2 - x1) /2 +x1} ${y2+20} C${(x2 - x1) /2 +x1} ${y2 + 20} ${(x2-x1)/2+x1} ${y2 + 5} ${x2}
                            ,${y2}`
                );
                target.appendChild(riLine);
            }
             
            return;
        }
        /* 
            两个容器不在同一y轴上,判断纵坐标：(绘制三段线，2条折线1条曲线)
            (1) 左侧y < 右侧y ，表示右侧为group,暂不需要对容器进行处理
            (2) 左侧为group时，若右侧为非成功状态，左侧容器的右引导线也设为虚线
        */

        // 左项是group且右项也是group时，只作直线
        if(Object.prototype.hasOwnProperty.call(cur, 'rootKey') && Object.prototype.hasOwnProperty.call(next, 'rootKey')) {
            return;
        }

        // 左侧单项，右侧为group,计算坐标
        if (dom1.y < dom2.y) {
            // 第一段折线
            line.setAttributeNS(
                null,
                'points',
                `${(x2 - x1) / 2 + x1},${y1+20} ${(x2 - x1) / 2 + x1},${y2 - 20}`
            );
            // 增加曲线
            const qline = document.createElementNS(svgns, 'path');
            qline.setAttributeNS(null, 'fill', `none`);
            qline.setAttributeNS(null, 'stroke', style.color);
            qline.setAttributeNS(null, 'stroke-width', style.size);
            qline.setAttributeNS(
                null,
                'd',
                `M${(x2 - x1) / 2 + x1} ${y2 - 20} C${(x2 - x1) / 2 + x1} ${y2 - 20} ${(x2 - x1) /
                    2 +
                    x1} ${y2 - 5} ${x2 - 0},${y2}`
            );
            target.appendChild(qline);
            // 第二段折线
            const secLine = document.createElementNS(svgns, 'polyline');
            secLine.setAttributeNS(null, 'fill', `none`);
            secLine.setAttributeNS(null, 'stroke', style.color);
            secLine.setAttributeNS(null, 'stroke-width', style.size);
            secLine.setAttributeNS(null, 'points', `${x2},${y2} ${x2-0},${y2}`);
            target.appendChild(secLine);
            // 全直折线
            // line.setAttributeNS(null,'points', `${(x2-x1)/2+x1},${y1} ${(x2-x1)/2+x1},${y2} ${x2},${y2}`);
        }
        // 左侧为group，右侧单项，计算坐标
        else {
            // 判断右侧容器状态,非success状态时，更新左侧容器样式为虚线
            // if(!pass2) {
            //     document.getElementById(`right${cur.key}`).style.border = `1px solid ${style.color}`;
            // }

            // line.setAttributeNS(null, 'points', `${x1-10},${y1} ${x1 + 0},${y1}`);
            // 增加曲线
            const qline = document.createElementNS(svgns, 'path');
            qline.setAttributeNS(null, 'fill', `none`);
            qline.setAttributeNS(null, 'stroke', style.color);
            qline.setAttributeNS(null, 'stroke-width', style.size);
            qline.setAttributeNS(
                null,
                'd',
                `M${x1-0},${y1} C${x1 + 0},${y1} ${(x2 - x1) / 2 + x1 } ${y1} ${(x2 - x1) /
                    2 +
                    x1} ${y1 - 20}`
            );
            target.appendChild(qline);
            // 第二段折线
            const secLine = document.createElementNS(svgns, 'polyline');
            secLine.setAttributeNS(null, 'fill', `none`);
            secLine.setAttributeNS(null, 'stroke', style.color);
            secLine.setAttributeNS(null, 'stroke-width', style.size);
            secLine.setAttributeNS(
                null,
                'points',
                `${(x2 - x1) / 2 + x1},${y1 - 20} ${(x2 - x1) / 2 + x1},${y2+20}`
            );
            target.appendChild(secLine);
            // 全直折线
            // line.setAttributeNS(null,'points', `${x1},${y1} ${(x2-x1)/2+x1},${y1} ${(x2-x1)/2+x1},${y2}`);
        }

        target.appendChild(line);
    }
    // 鼠标经过时渲染
    changeBg(key, active) {
        if (!isActive && active) {
            const target = document.getElementById(key)?.childNodes[1];
            const bg = this.getRGB(target.children[0]?.style.backgroundColor);
            target.children[1].style.backgroundColor = `rgba(${bg[0]},${bg[1]},${bg[2]},0.2)`;
            isActive = true;
        }
        if (isActive && !active) {
            const target = document.getElementById(key)?.childNodes[1];
            target.children[1].style.backgroundColor = `#ffffff`;
            isActive = false;
        }
    }

    render() {
        const { lineData, lineTitle } = this.props;
        if (!lineData.length) return <></>;
        return (
            <div id="pipeDiv" className={s.pipeDiv}>
                <div id="pipeCanvas" className={s.pipeCanvas}>
                    <div className={s.svgDiv}>
                        <svg id="pipeSvg" xmlns="http://www.w3.org/2000/svg" className={s.svg} />
                    </div>
                    {this.renderTitle(lineTitle)}
                    {this.rendetContext(lineData)}
                </div>
            </div>
        );
    }
}

export default PipeLine;
