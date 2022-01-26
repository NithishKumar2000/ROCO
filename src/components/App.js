import React, {Component} from 'react'
import './App.css'
import Navbar from './Navbar'
import Web3 from 'web3'
import Tether from '../truffle-abis/Tether.json'
import Reward from '../truffle-abis/Reward.json'
import DecentralBank from '../truffle-abis/DecentralBank.json'
import Main from './Main.js'
import ParticleSettings from './ParticleSettings'

class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadweb3()
        await this.loadBlockchainData()
    }

    async loadweb3() {
        if(window.ethereum){
            window.web3=new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if(window.web3)
        {
            window.web3=new Web3(window.web3.currentProvider)
        }
        else{
            window.alert('No wthereum browser Detected')
        }
    }

    async loadBlockchainData(){
        const web3=window.web3
        const account=await web3.eth.getAccounts()
        this.setState({account:account[0]})
        console.log(account)
        const networkId= await web3.eth.net.getId()

        const tetherData= Tether.networks[networkId]
        if(tetherData)
        {
            const tether= new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({tether})
            let tetherBalance=await tether.methods.balance_of(this.state.account).call()
            this.setState({tetherBalance:tetherBalance.toString()})
            console.log({balance: tetherBalance})
        }else{
            window.alert('Error')
        }

        const rwdData= Reward.networks[networkId]
        if(rwdData)
        {
            const reward= new web3.eth.Contract(Reward.abi, rwdData.address)
            this.setState({reward})
            let rwdBalance=await reward.methods.balance_of(this.state.account).call()
            this.setState({rwdBalance:rwdBalance.toString()})
            console.log({balance: rwdBalance})
        }else{
            window.alert('Error')
        }

        const decentralBankData= DecentralBank.networks[networkId]
        if(decentralBankData)
        {
            const decentralBank= new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance=await decentralBank.methods.balance_of(this.state.account).call()
            this.setState({stakingBalance:stakingBalance.toString()})
            console.log({balance: stakingBalance})
        }else{
            window.alert('Error')
        }

        this.setState({loading:false})
        
    }

    stakeTokens= (amount)=>{
        this.setState({loading:true})
        this.state.tether.methods.approve(this.state.decentralBank.address,amount).send({from:this.state.account}).on('transactionHash',(hash)=>{
        this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.account}).on('transactionHash',hash=>{
            this.setState({loadiing:false})
        })
        })
    }

    unstakeTokens= (amount)=>{
        this.setState({loading:true})
        this.state.decentralBank.methods.unstakeTokens(amount).send({from:this.state.account}).on('transactionHash',hash=>{
            this.setState({loadiing:false})
        })
    }
    constructor(props)
    {
        super(props)
        this.state={
            account:'0x0',
            tether:{},
            reward:{},
            decentralBank:{},
            tetherBalance:'0',
            rwdBalance:'0',
            stakingBalance:'0',
            loading:true


        }
    }

    render()
    {
        let content
        {this.state.loading?content=<p id='loader' className='text-center' style={{margin:'30px'}}>LOADING PLEASE...</p>:content=<Main
            tetherBalance={this.state.tetherBalance}
            rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
        />}
        return(
            <div className='App' style={{position:'relative'}}>
            <div style={{position:'absolute'}}><ParticleSettings/></div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                <Main/>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;