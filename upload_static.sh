gsutil -m rsync -r static gs://stellar-ether-198321.appspot.com/
gsutil -m acl ch -r -u AllUsers:R gs://stellar-ether-198321.appspot.com/
