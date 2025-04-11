import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [clientContext, setClientContext] = useState(null);
  const [locationContext, setLocationContext] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 检查SDK是否已加载
    const checkSDK = () => {
      if (window.sdk) {
        console.log('Farcaster SDK 已加载');
        try {
          const context = window.sdk.context;
          console.log('SDK Context:', context);
          
          if (context) {
            // 设置上下文数据
            setUserContext(context.user);
            setClientContext(context.client);
            setLocationContext(context.location);
            setSdkLoaded(true);
          } else {
            setError('SDK 上下文不可用');
          }
        } catch (e) {
          console.error('获取 SDK 上下文时出错:', e);
          setError(e.message || '读取 SDK 上下文时出错');
        }
      } else {
        // 在 Warpcast 之外运行时可能没有 SDK
        console.warn('Farcaster SDK 不可用 - 您可能不是在 Warpcast 应用内运行');
        setError('请在 Warpcast 应用内打开此 Mini App');
      }
    };

    // 首次加载时检查
    checkSDK();

    // 每秒检查一次，以防 SDK 加载延迟
    const interval = setInterval(() => {
      if (!window.sdk) {
        checkSDK();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 渲染用户信息部分
  const renderUserInfo = () => {
    if (!userContext) return null;
    
    return (
      <div className="user-info">
        {userContext.pfpUrl && (
          <img 
            src={userContext.pfpUrl} 
            alt={userContext.displayName || userContext.username || `用户 #${userContext.fid}`} 
            className="user-pfp"
          />
        )}
        <div className="user-details">
          <h2>{userContext.displayName || userContext.username || `用户 #${userContext.fid}`}</h2>
          {userContext.username && <p className="username">@{userContext.username}</p>}
          <p className="fid">FID: {userContext.fid}</p>
        </div>
      </div>
    );
  };

  // 渲染客户端信息部分
  const renderClientInfo = () => {
    if (!clientContext) return null;
    
    return (
      <div className="client-info">
        <h3>客户端信息</h3>
        <p>客户端 FID: {clientContext.clientFid}</p>
        <p>已添加此应用: {clientContext.added ? '是' : '否'}</p>
        {clientContext.notificationDetails && (
          <p className="notification-enabled">通知已启用</p>
        )}
      </div>
    );
  };

  // 渲染位置上下文信息
  const renderLocationInfo = () => {
    if (!locationContext) return null;
    
    let locationDetails;
    
    switch(locationContext.type) {
      case 'cast_embed':
        locationDetails = (
          <>
            <p>来自嵌入 Cast</p>
            <p>Cast FID: {locationContext.cast.fid}</p>
            <p>Cast Hash: {locationContext.cast.hash}</p>
          </>
        );
        break;
      case 'notification':
        locationDetails = (
          <>
            <p>来自通知</p>
            <p>标题: {locationContext.notification.title}</p>
            <p>内容: {locationContext.notification.body}</p>
          </>
        );
        break;
      case 'launcher':
        locationDetails = <p>从启动器打开</p>;
        break;
      case 'channel':
        locationDetails = (
          <>
            <p>从频道打开</p>
            <p>频道: {locationContext.channel.name}</p>
          </>
        );
        break;
      default:
        locationDetails = <p>未知来源</p>;
    }
    
    return (
      <div className="location-info">
        <h3>打开位置</h3>
        {locationDetails}
      </div>
    );
  };

  // 渲染安全区域
  const getSafeAreaStyle = () => {
    if (!clientContext || !clientContext.safeAreaInsets) return {};
    
    const { top, bottom, left, right } = clientContext.safeAreaInsets;
    
    return {
      paddingTop: `${top}px`,
      paddingBottom: `${bottom}px`,
      paddingLeft: `${left}px`,
      paddingRight: `${right}px`,
    };
  };

  if (error) {
    return (
      <div className="app">
        <div className="app-header error-state">
          <h1>Farcaster Mini App</h1>
          <div className="error-message">
            <p>{error}</p>
            <p>此应用需要在 Warpcast 内运行才能访问 Farcaster SDK。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={getSafeAreaStyle()}>
      <div className="app-header">
        <h1>Farcaster Mini App</h1>
        <p>一个简单的示例应用</p>
        
        {!sdkLoaded ? (
          <p>正在加载 Farcaster SDK...</p>
        ) : (
          <div className="sdk-content">
            {renderUserInfo()}
            {renderLocationInfo()}
            {renderClientInfo()}
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 