public with sharing class FileUploaderClass {
    /*
   * @method uploadFile() 
   * @desc Creates a content version from a given file's base64 and name
   * 
   * @param {String} base64 - base64 string that represents the file
   * @param {String} filename - full file name with extension, i.e. 'products.csv'
   * @param {String} recordId - Id of the record you want to attach this file to
   * 
   * @return {ContentVersion} - returns the created ContentDocumentLink Id if the
   *   upload was successful, otherwise returns null
   */
   @AuraEnabled
  public static String uploadFile(String base64, String filename, String productId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, productId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
  }
  /*
   * @method createContentVersion() [private]
   * @desc Creates a content version from a given file's base64 and name
   * 
   * @param {String} base64 - base64 string that represents the file
   * @param {String} filename - full file name with extension, i.e. 'products.csv'
   * 
   * @return {ContentVersion} - returns the newly created ContentVersion, or null
   *   if there was an error inserting the record
   */
  private static ContentVersion createContentVersion(String base64, String filename) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    try {
      insert cv;
      return cv;
    } catch(DMLException e) {
      System.debug(e);
      return null;
    }
  }

   /*
   * @method createContentLink() [private]
   * @desc Creates a content link for a given ContentVersion and record
   * 
   * @param {String} contentVersionId - Id of the ContentVersion of the file
   * @param {String} recordId - Id of the record you want to attach this file to
   * 
   * @return {ContentDocumentLink} - returns the newly created ContentDocumentLink, 
   *   or null if there was an error inserting the record
   */
  private static ContentDocumentLink createContentLink(String contentVersionId, String productId) {
      System.debug('bnf productId '+productId);
              if (contentVersionId == null || productId == null) { return null; }
    ContentDocumentLink cdl = new ContentDocumentLink();
    cdl.ContentDocumentId = [
      SELECT ContentDocumentId 
      FROM ContentVersion 
      WHERE Id =: contentVersionId
    ].ContentDocumentId;
    cdl.LinkedEntityId = productId;
    cdl.Visibility = 'AllUsers';
    // ShareType is either 'V', 'C', or 'I'
    // V = Viewer, C = Collaborator, I = Inferred
    cdl.ShareType = 'V';
    try {
      insert cdl;
      return cdl;
    } catch(DMLException e) {
      System.debug(e);
      return null;
    }
  }

  public static Map<String, String> getProductsFiles(List<String> productsIds){
    Map<String, String> mapProductFile = new Map<String, String>();
    Map<String, String> mapContentFile = new Map<String, String>();
    List<String> lstContent = new List<String>();

    List<ContentDocumentLink> listContentDocument = [SELECT ContentDocumentId,LinkedEntityId
                                                    FROM ContentDocumentLink 
                                                    WHERE LinkedEntityId IN: productsIds];

    for (ContentDocumentLink cont : listContentDocument) {
      lstContent.add(cont.ContentDocumentId);
      mapContentFile.put(cont.ContentDocumentId, cont.LinkedEntityId);
    }

    List<ContentVersion> listContentVersion = [SELECT Id, ContentDocumentId 
                                                    FROM ContentVersion 
                                                    WHERE ContentDocumentId IN: lstContent];

    for (ContentVersion contV : listContentVersion) {
      if(mapContentFile.containsKey(contV.ContentDocumentId)){
        mapProductFile.put(mapContentFile.get(contV.ContentDocumentId), contV.Id);
      }
    }

    return mapProductFile;
  }
    
}