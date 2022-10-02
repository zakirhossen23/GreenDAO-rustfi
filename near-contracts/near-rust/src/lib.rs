use near_sdk::{
  borsh::{ self, BorshDeserialize, BorshSerialize },
  near_bindgen,
  serde_json
};

use std::collections::HashMap;


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
  //Variables
  _dao_ids: i32,
  _goal_ids: i32,

  //Variables Multiples
   _dao_uris: HashMap<i32, Vec<String>>,           //_dao_ids          => (Dao)    Dao Wallet + Dao URI   + Finished
   _goal_uris: HashMap<i32, Vec<String>>,          //_goal_ids         => (Goal)   URI          
  
}

impl Default for Contract {
  fn default() -> Self {
    Self {
      //Variables
      _dao_ids : 0,
      _goal_ids : 0,

      //Variables Multiples
      _dao_uris: HashMap::new(), 
      _goal_uris: HashMap::new(), 
    }
  }
}



#[near_bindgen]
impl Contract {
 
  //Daos
  pub fn create_dao(&mut self, _dao_wallet: String, _dao_uri: String) -> i32 {
    let mut stuff : Vec<String> = Vec::new();
    stuff.push(_dao_wallet.to_string());
    stuff.push(_dao_uri.to_string());
    stuff.push("False".to_string());

    self._dao_uris.insert(self._dao_uris.len() as i32,stuff);
    self._dao_ids += 1;
    return self._dao_ids ;
  }

  pub fn set_dao(&mut self, _dao_id: &i32, _dao_wallet: String,_dao_uri: String) {
    self._dao_uris.get_mut(_dao_id).unwrap()[0] = (*_dao_wallet).to_string();
    self._dao_uris.get_mut(_dao_id).unwrap()[1] = (*_dao_uri).to_string(); 
  }


  pub fn get_all_daos(&self)-> String{
    let json = serde_json::to_string(&self._dao_uris).unwrap();
    return json;
  }
  pub fn get_all_daos_from_wallet(&self,wallet:String)-> String{
    let mut stuff : Vec<String> = Vec::new(); 
    for  (_k, v) in self._dao_uris.iter() {
      if  v[0].to_string() == wallet.to_string() {
        stuff.push(v[1].to_string());
      }
    }    
    let json = serde_json::to_string(&stuff).unwrap();
    return json;
  }


  pub fn dao_uri(&self,dao_id:&i32)-> String{
    let json = serde_json::to_string(&self._dao_uris.get(dao_id)).unwrap();
    return json;
  }

  //Goals

  pub fn create_goal(&mut self, _goal_uri: String,_dao_id:&i32) -> i32 {
    let mut stuff : Vec<String> = Vec::new();
    stuff.push(_dao_id.to_string());
    stuff.push(_goal_uri.to_string());

    self._goal_uris.insert(self._goal_uris.len() as i32,stuff);
    self._goal_ids += 1;
    return self._goal_ids ;
  }

  pub fn set_goal(&mut self, _goal_id: &i32,_goal_uri: String) {
    self._goal_uris.get_mut(_goal_id).unwrap()[1] = (*_goal_uri).to_string(); 
  }


  pub fn get_all_goals(&self)-> String{
    let json = serde_json::to_string(&self._goal_uris).unwrap();
    return json;
  }

  pub fn get_all_goals_by_dao_id(&self, _dao_id: &i32)-> String{
    let mut stuff : HashMap<i32,String> = HashMap::new(); 
    for  (_k, v) in self._goal_uris.iter() {
      if  v[0].to_string() == _dao_id.to_string() {
        stuff.insert(*_k,v[1].to_string());
      }
    }    
    let json = serde_json::to_string(&stuff).unwrap();
    return json;
  }

  pub fn goal_uri(&self,goal_id:&i32)-> String{
    let json = serde_json::to_string(&self._goal_uris.get(goal_id)).unwrap();
    return json;
  }



//Contract
pub fn reset_all(&mut self) {  
  self._dao_ids = 0;

  //Variables
  self._dao_uris = HashMap::new();
}


}
  


#[cfg(test)]

// All Tests
#[test]
fn test_create_dao() {
    let mut contract = Contract::default();
  
    contract.create_dao(String::from("account1.wallet"),String::from("Dao metadata #1"));
 
    // println!(" Dao 0 => {:#?}",contract.get_all_daos());
    // let get_dao_uri = contract._dao_uris.get(&0);    
  }
  
  #[test]
  fn test_create_goal() {
      let mut contract = Contract::default();
    
      contract.create_goal(String::from("Goal metadata #1"),&0);
      contract.create_goal(String::from("Goal metadata #2"),&1);
   
      // println!("Goals => {:#?}",contract.get_all_goals_by_dao_id(&1));
      // let get_dao_uri = contract._dao_uris.get(&0);    
    }
    
  