import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Web3 } from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const Web3Context = createContext();

// Action types
const WEB3_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PROVIDER: 'SET_PROVIDER',
  SET_WEB3: 'SET_WEB3',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_NETWORK: 'SET_NETWORK',
  SET_CONTRACT: 'SET_CONTRACT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_BALANCE: 'SET_BALANCE',
};

// Initial state
const initialState = {
  provider: null,
  web3: null,
  accounts: [],
  currentAccount: null,
  networkId: null,
  contract: null,
  contractAddress: null,
  balance: '0',
  loading: true,
  error: null,
  isMetaMaskInstalled: false,
  isConnected: false,
};

// Reducer
const web3Reducer = (state, action) => {
  switch (action.type) {
    case WEB3_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case WEB3_ACTIONS.SET_PROVIDER:
      return { 
        ...state, 
        provider: action.payload,
        isMetaMaskInstalled: !!action.payload
      };
    
    case WEB3_ACTIONS.SET_WEB3:
      return { ...state, web3: action.payload };
    
    case WEB3_ACTIONS.SET_ACCOUNTS:
      return { 
        ...state, 
        accounts: action.payload,
        currentAccount: action.payload[0] || null,
        isConnected: action.payload.length > 0
      };
    
    case WEB3_ACTIONS.SET_NETWORK:
      return { ...state, networkId: action.payload };
    
    case WEB3_ACTIONS.SET_CONTRACT:
      return { 
        ...state, 
        contract: action.payload.contract,
        contractAddress: action.payload.address
      };
    
    case WEB3_ACTIONS.SET_BALANCE:
      return { ...state, balance: action.payload };
    
    case WEB3_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case WEB3_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);
  const { user, connectWallet } = useAuth();

  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: true });
        
        // Detect MetaMask
        const provider = await detectEthereumProvider();
        
        if (provider) {
          dispatch({ type: WEB3_ACTIONS.SET_PROVIDER, payload: provider });
          
          // Initialize Web3
          const web3Instance = new Web3(provider);
          dispatch({ type: WEB3_ACTIONS.SET_WEB3, payload: web3Instance });
          
          // Get network ID
          const networkId = await web3Instance.eth.net.getId();
          dispatch({ type: WEB3_ACTIONS.SET_NETWORK, payload: networkId.toString() });
          
          // Load contract if available
          await loadContract(web3Instance);
          
          // Check if already connected
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            dispatch({ type: WEB3_ACTIONS.SET_ACCOUNTS, payload: accounts });
            await updateBalance(web3Instance, accounts[0]);
          }
          
          // Listen for account changes
          provider.on('accountsChanged', handleAccountsChanged);
          provider.on('chainChanged', handleChainChanged);
          provider.on('disconnect', handleDisconnect);
          
        } else {
          dispatch({ 
            type: WEB3_ACTIONS.SET_ERROR, 
            payload: 'MetaMask not detected. Please install MetaMask.' 
          });
        }
      } catch (error) {
        console.error('Web3 initialization error:', error);
        dispatch({ 
          type: WEB3_ACTIONS.SET_ERROR, 
          payload: 'Failed to initialize Web3' 
        });
      } finally {
        dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initWeb3();

    // Cleanup
    return () => {
      if (state.provider) {
        state.provider.removeListener('accountsChanged', handleAccountsChanged);
        state.provider.removeListener('chainChanged', handleChainChanged);
        state.provider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  // Load smart contract
  const loadContract = async (web3Instance) => {
    try {
      // Try to load contract address and ABI
      const response = await fetch('/contracts/contract-address.json');
      const addresses = await response.json();
      
      const abiResponse = await fetch('/contracts/VotingSystem.json');
      const contractABI = await abiResponse.json();
      
      if (addresses.VotingSystem && contractABI) {
        const contract = new web3Instance.eth.Contract(
          JSON.parse(contractABI),
          addresses.VotingSystem
        );
        
        dispatch({
          type: WEB3_ACTIONS.SET_CONTRACT,
          payload: {
            contract,
            address: addresses.VotingSystem
          }
        });
      }
    } catch (error) {
      console.log('Contract not loaded:', error.message);
    }
  };

  // Update balance
  const updateBalance = async (web3Instance, account) => {
    try {
      const balance = await web3Instance.eth.getBalance(account);
      const balanceInEth = web3Instance.utils.fromWei(balance, 'ether');
      dispatch({ type: WEB3_ACTIONS.SET_BALANCE, payload: balanceInEth });
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  // Event handlers
  const handleAccountsChanged = async (accounts) => {
    dispatch({ type: WEB3_ACTIONS.SET_ACCOUNTS, payload: accounts });
    
    if (accounts.length > 0 && state.web3) {
      await updateBalance(state.web3, accounts[0]);
    } else {
      dispatch({ type: WEB3_ACTIONS.SET_BALANCE, payload: '0' });
    }
  };

  const handleChainChanged = async (chainId) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const handleDisconnect = () => {
    dispatch({ type: WEB3_ACTIONS.SET_ACCOUNTS, payload: [] });
    dispatch({ type: WEB3_ACTIONS.SET_BALANCE, payload: '0' });
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      if (!state.provider) {
        toast.error('MetaMask not detected. Please install MetaMask.');
        return { success: false };
      }

      dispatch({ type: WEB3_ACTIONS.CLEAR_ERROR });
      
      // Request account access
      const accounts = await state.provider.request({
        method: 'eth_requestAccounts',
      });
      
      dispatch({ type: WEB3_ACTIONS.SET_ACCOUNTS, payload: accounts });
      
      if (accounts.length > 0 && state.web3) {
        await updateBalance(state.web3, accounts[0]);
        
        // If user is logged in, connect wallet to account
        if (user && !user.walletAddress) {
          // Generate a signature for wallet verification
          const message = `Connect wallet to ${user.email} at ${new Date().toISOString()}`;
          try {
            const signature = await state.provider.request({
              method: 'personal_sign',
              params: [message, accounts[0]],
            });
            
            await connectWallet(accounts[0], signature);
          } catch (signError) {
            console.error('Signature error:', signError);
            // Continue without connecting to backend
          }
        }
        
        toast.success('Wallet connected successfully!');
        return { success: true, account: accounts[0] };
      }
      
      return { success: false };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      
      let message = 'Failed to connect to MetaMask';
      if (error.code === 4001) {
        message = 'Connection rejected by user';
      } else if (error.code === -32002) {
        message = 'Connection request already pending';
      }
      
      dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: WEB3_ACTIONS.SET_ACCOUNTS, payload: [] });
    dispatch({ type: WEB3_ACTIONS.SET_BALANCE, payload: '0' });
    toast.success('Wallet disconnected');
  };

  // Switch to correct network
  const switchNetwork = async (chainId = '0x7a69') => { // Default to Hardhat local network
    try {
      await state.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return { success: true };
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await state.provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId,
              chainName: 'Hardhat Local',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:8545'],
            }],
          });
          return { success: true };
        } catch (addError) {
          console.error('Failed to add network:', addError);
          return { success: false, error: 'Failed to add network' };
        }
      }
      console.error('Failed to switch network:', error);
      return { success: false, error: 'Failed to switch network' };
    }
  };

  // Send transaction
  const sendTransaction = async (transactionConfig) => {
    try {
      if (!state.currentAccount) {
        throw new Error('No account connected');
      }

      const txHash = await state.web3.eth.sendTransaction({
        from: state.currentAccount,
        ...transactionConfig,
      });

      return { success: true, txHash };
    } catch (error) {
      console.error('Transaction error:', error);
      return { success: false, error: error.message };
    }
  };

  // Call contract method
  const callContractMethod = async (methodName, params = [], options = {}) => {
    try {
      if (!state.contract) {
        throw new Error('Contract not loaded');
      }

      const method = state.contract.methods[methodName](...params);
      
      if (options.send) {
        // Send transaction
        const result = await method.send({
          from: state.currentAccount,
          ...options,
        });
        return { success: true, result };
      } else {
        // Call method (read-only)
        const result = await method.call();
        return { success: true, result };
      }
    } catch (error) {
      console.error('Contract method error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get transaction receipt
  const getTransactionReceipt = async (txHash) => {
    try {
      const receipt = await state.web3.eth.getTransactionReceipt(txHash);
      return { success: true, receipt };
    } catch (error) {
      console.error('Get receipt error:', error);
      return { success: false, error: error.message };
    }
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Convert Wei to Ether
  const fromWei = (value, unit = 'ether') => {
    if (!state.web3) return '0';
    return state.web3.utils.fromWei(value.toString(), unit);
  };

  // Convert Ether to Wei
  const toWei = (value, unit = 'ether') => {
    if (!state.web3) return '0';
    return state.web3.utils.toWei(value.toString(), unit);
  };

  const value = {
    ...state,
    connectMetaMask,
    disconnectWallet,
    switchNetwork,
    sendTransaction,
    callContractMethod,
    getTransactionReceipt,
    formatAddress,
    fromWei,
    toWei,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
