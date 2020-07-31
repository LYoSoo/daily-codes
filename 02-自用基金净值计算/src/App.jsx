import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Icon, Input, Table, Col, Statistic, Card, Row, message } from "antd";
import "antd/dist/antd.css";
const columns = [
    {
        title: "序号",
        dataIndex: "index",
        key: "index",
    },
    {
        title: "基金代码",
        dataIndex: "code",
        key: "code",
    },
    {
        title: "基金名称",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "当前基金单位净值",
        dataIndex: "netWorth",
        key: "netWorth",
    },
    {
        title: "当前基金单位净值估算",
        dataIndex: "expectWorth",
        key: "expectWorth",
    },
    {
        title: "基金份额",
        dataIndex: "share",
        key: "share",
    },
    {
        title: "总金额",
        dataIndex: "totalCount",
        key: "totalCount"
    },
    {
        title: "当前基金单位净值估算日涨幅",
        dataIndex: "expectGrowth",
        key: "expectGrowth",
    },
    {
        title: "单位净值日涨幅",
        dataIndex: "dayGrowth",
        key: "dayGrowth",
    },
    {
        title: "净值估算更新时间",
        dataIndex: "expectWorthDate",
        key: "expectWorthDate",
    }
];
// code	String
// 基金代码

// name	String
// 基金名称

// netWorth	Number
// 当前基金单位净值

// expectWorth	Number
// 当前基金单位净值估算

// expectGrowth	String
// 当前基金单位净值估算日涨幅, 单位为百分比

// dayGrowth	String
// 单位净值日涨幅, 单位为百分比

// lastWeekGrowth	String
// 单位净值周涨幅, 单位为百分比

// lastMonthGrowth	String
// 单位净值月涨幅, 单位为百分比

// lastThreeMonthsGrowth	String
// 单位净值三月涨幅, 单位为百分比

// lastSixMonthsGrowth	String
// 单位净值六月涨幅, 单位为百分比

// lastYearGrowth	String
// 单位净值年涨幅, 单位为百分比

// netWorthDate	String
// 净值更新日期, 日期格式为yy - MM - dd HH: mm.2019 - 06 - 27 15: 00代表当天下午3点

// expectWorthDate	String
// 净值估算更新日期,, 日期格式为yy - MM - dd HH: mm.2019 - 06 - 27 15: 00代表当天下午3点
const dataInfo = [{ code: "005176", share: 2341.58 }, { code: "002217", share: 3303.67 }, { code: "003095", share: 2046.4 }, { code: "320007", share: 3659.09 }, { code: "167301", share: 3490.83 }, { code: "501030", share: 5884.31 }, { code: "000083", share: 1051.77 },
{ code: "005224", share: 4186.77 }, { code: "005911", share: 900.23 }, { code: "004856", share: 1125 }, { code: "005223", share: 562.29 }, { code: "008281", share: 930.45 }, { code: "001595", share: 4556.1 }, { code: "519674", share: 1061.25 }, { code: "007490", share: 1709.66 },
{ code: "161725", share: 1346.27 }, { code: "502023", share: 3318.28 }, { code: "165525", share: 883.57 }]
function App() {
    const [reload, setReload] = useState(true);
    const [tableInfo, setTableInfo] = useState([]);
    const [totalMoney, setTotalMoney] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hide, setHide] = useState(true);
    const [pwd, setPwd] = useState("");
    const queryStr = "code=005176,002217,003095,320007,167301,501030,000083,005224,005911,004856,005223,008281,001595,519674,007490,161725,502023,165525"
    useEffect(() => {
        setLoading(true)
        axios.get(`https://api.doctorxiong.club/v1/fund?${queryStr}`).then(
            res => {
                let { data: { data } } = res;
                let realData = [];
                for (let item of data) {
                    let temp = dataInfo.filter(info => info.code === item.code)[0];
                    if (!!temp) {
                        realData = [...realData, { ...item, ...temp }];
                    }
                }
                realData.sort((a, b) => { return (b.expectGrowth - a.expectGrowth) });
                realData.map((item, index) => {
                    item.totalCount = (item.share * item.netWorth).toFixed(2);
                    item.index = index + 1;
                });
                setTableInfo(realData);
            },
            err => {
                message.error("出错了");
                setLoading(false);
            }
        )
    }, [reload]);
    useEffect(() => {
        let totalMoneyCount = 0;
        tableInfo.map(item => {
            console.log(item.name, item.share * (item.expectWorth - item.netWorth));
            totalMoneyCount += item.share * (item.expectWorth - item.netWorth);
        })
        setTotalMoney(totalMoneyCount);
        setLoading(false);
        message.success("刷新成功")
    }, [tableInfo])
    const changePwd = (e) => {
        setPwd(e.target.value);
    }
    const confirmPwd = () => {
        if (pwd === "929577") {
            setHide(!hide);
        }
    }
   
    return (
        <div>

            <Row>
                <Button type="primary" onClick={() => { setReload(!reload) }}>{"刷新"}</Button >
                <Input style={{ width: 100 }} value={pwd} type="password" onChange={(e) => { changePwd(e) }} />
                <Button type="primary" onClick={() => { confirmPwd() }}>{"切换状态"}</Button >
                {
                    totalMoney > 0 ?
                        <Card>
                            <Statistic
                                title=""
                                value={totalMoney}
                                precision={2}
                                valueStyle={{ color: 'red' }}
                                prefix={<Icon type="arrow-up" />}
                                suffix="阿玛币"
                            />
                        </Card> :
                        <Card>
                            <Statistic
                                title=""
                                value={totalMoney}
                                precision={2}
                                valueStyle={{ color: 'green' }}
                                prefix={<Icon type="arrow-down" />}
                                suffix="阿玛币"
                            />
                        </Card>
                }
                {/* <Button style={{ marginTop: 16 }} type="primary" onClick={() => { calculation() }}>
                    {"计算盈亏"}
                </Button> */}
            </Row>
            <Row>
                {!hide && <Table dataSource={tableInfo} columns={columns} loading={loading} size="small" pagination={false} />}
            </Row>
        </div>
    )
}

export default App;