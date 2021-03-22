import React from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function NavBar(props) {
  // Fonction pour rendre le props.token pour déconnecter
  const deconnection = () => {
    props.logout();
  };

  // Menu déroulant stats
  const menu = (
    <Menu className="navcolumn">
      <Menu.Item key="week">
        <Link to="/week">Hebdomadaires</Link>
      </Menu.Item>
      <Menu.Item key="month">
        <Link to="/month">Mensuelles</Link>
      </Menu.Item>
      <Menu.Item key="year">
        <Link to="/year">Annuelles</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav style={{ width: "100%" }}>
      <Menu className="navbar" mode="horizontal" theme="light">
        <Link to="/settings">
          <Menu.Item key="profil">
            <FontAwesomeIcon
              className="icon-today"
              icon={faUser}
              size="1x"
              style={{ color: "#5b63ae", marginTop: 16, marginRight: 0 }}
            />
          </Menu.Item>
        </Link>

        <Link to="/today">
          <Menu.Item key="today">Aujourd'hui</Menu.Item>
        </Link>

        <Dropdown overlay={menu} trigger={["click"]}>
          <Link
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
          >
            Statistiques
            <DownOutlined />
          </Link>
        </Dropdown>

        <Link onClick={() => deconnection()} to="/">
          <Menu.Item key="deconnexion">Déconnexion</Menu.Item>
        </Link>
      </Menu>
    </nav>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch({ type: "deconnexion" });
    },
    modifyPseudo: (newPseudo) => {
      dispatch({ type: "modify-pseudo", newPseudo });
    },
  };
}

function mapStateToProps(state) {
  return {
    pseudo: state.pseudo,
    token: state.token,
  };
}

export default connect(null, mapDispatchToProps)(NavBar);
