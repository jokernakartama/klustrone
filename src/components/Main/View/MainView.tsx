import './styles/MainView.styl'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch } from 'react-router-dom'
import { TRASH_URL_IDENTIFIER } from '~/api'
import bem from '~/utils/bemName'
import { loc } from '~/constants'
import UIDialog from '~/components/UI/Dialog'
import HomePage from '~/components/HomePage'
import StaticPage from '~/components/StaticPage'
import FileManager from '~/components/FileManager'
import ServiceManager from '~/components/ServiceManager'
import ServicePanel from '~/components/ServicePanel'
import ResourceInfo from '~/components/ResourceInfo'
import ActionsPanel from '~/components/ActionsPanel'
import ResourceList from '~/components/ResourceList'

const renderStaticPage = (matches) => {
  return (
    <StaticPage pageName={ matches.match.params.request } url={ matches.url } />
  )
}

const MainView: React.SFC<IMainViewComponent.Props> = ({ loading }) => {
  const contentClass = bem({ block: 'content', mod: { loading } })
  const spinnerClass = bem({ block: 'loading-spinner', mod: { loading } })
  return (
    <div className='main'>
      <ServiceManager>
        <ServicePanel />
      </ServiceManager>
      <div className={ contentClass }>
        <Switch>
          <Route exact={ true } path='/'>
            <HomePage />
          </Route>
          <Route exact={ true } path={ '/:service([a-z,0-9,-]+):(' + TRASH_URL_IDENTIFIER + ')?/:path(.*)' }>
            <FileManager>
              <ResourceList />
              <ActionsPanel />
              <ResourceInfo />
            </FileManager>
          </Route>
          <Route
            exact={ true }
            path='/:request([^:]+)'
            render={ renderStaticPage }
          />
        </Switch>
      </div>
      { ReactDOM.createPortal(<UIDialog />, window.document.getElementById('modal')) }
      <div className={ spinnerClass }>{ loc.IS_LOADING }</div>
    </div>
  )
}

export default MainView
