# 📝 Instructions de Test d'Authentification DjuntaCar

## Configuration
- **Email de test**: william.farreaux@gmail.com
- **Langue**: Français
- **Mot de passe initial**: TestPassword123! (ou votre choix)

---

## 🧪 Option 1: Utiliser l'Outil de Test Automatisé (RECOMMANDÉ)

### Étape Préliminaire: Ouvrir l'outil
1. Ouvrez un navigateur web (Chrome, Firefox, Safari, etc.)
2. Naviguez vers: `http://localhost:8080/test-auth-flow.html` (si serveur local) ou ouvrez le fichier directement
3. L'outil charge automatiquement le client Supabase

### ✅ ÉTAPE 1: Création de Compte (Signup)

#### Ce que fait le code:
```javascript
const { data, error } = await DJUNTA.sb.auth.signUp({
    email: 'william.farreaux@gmail.com',
    password: 'TestPassword123!'
});
```

#### Instructions:
1. **Vérifiez** que l'email est pré-rempli: `william.farreaux@gmail.com`
2. **Vérifiez** que le mot de passe est pré-rempli: `TestPassword123!`
3. **Cliquez** sur le bouton "🚀 Créer le compte"
4. **Observez** la console de test pour voir les logs détaillés
5. **Attendez** l'affichage du message de succès

#### ⏸️ STOP - Action Requise:
- **VÉRIFIEZ VOTRE BOÎTE EMAIL** (william.farreaux@gmail.com)
- Cherchez un email de **Supabase** avec le sujet similaire à "Confirm your signup"
- **CLIQUEZ** sur le lien de confirmation dans l'email
- **CONFIRMEZ** que le lien fonctionne et vous redirige correctement

#### Erreurs possibles à signaler:
- ❌ "User already registered" → L'email existe déjà (OK, continuez)
- ❌ "Invalid email or password" → Vérifiez les credentials
- ❌ Pas d'email reçu → Vérifiez les spams, attendez 2-3 minutes
- ❌ Tout autre message d'erreur dans la console

---

### ✅ ÉTAPE 2: Réinitialisation du Mot de Passe

#### Ce que fait le code:
```javascript
const { error } = await DJUNTA.sb.auth.resetPasswordForEmail(
    'william.farreaux@gmail.com',
    { redirectTo: window.location.origin + '/reset-password-confirm.html' }
);
```

#### Instructions:
1. **Cliquez** "Oui" quand on vous demande si vous avez confirmé votre email
2. **Vérifiez** que l'email est: `william.farreaux@gmail.com`
3. **Cliquez** sur le bouton "📧 Envoyer l'email de réinitialisation"
4. **Observez** les logs dans la console de test

#### ⏸️ STOP - Action Requise:
- **VÉRIFIEZ VOTRE BOÎTE EMAIL** à nouveau
- Cherchez un email de **Supabase** avec "Reset your password" ou similaire
- **CLIQUEZ** sur le lien de réinitialisation
- **VOUS SEREZ REDIRIGÉ** vers `reset-password-confirm.html`
- **DÉFINISSEZ** un nouveau mot de passe (par ex: `NewPassword456!`)
- **NOTEZ** ce nouveau mot de passe pour l'étape 3

#### Vérifications à faire:
- ✅ L'email est-il bien reçu?
- ✅ Le lien fonctionne-t-il?
- ✅ La page `reset-password-confirm.html` s'affiche-t-elle correctement?
- ✅ Le formulaire de nouveau mot de passe fonctionne-t-il?
- ✅ L'email de réinitialisation est-il correctement formaté (en français)?

#### Erreurs possibles à signaler:
- ❌ Pas d'email reçu → Vérifiez les spams
- ❌ Lien expiré → Recommencez l'étape 2
- ❌ Page de reset ne charge pas → Vérifiez l'URL de redirection
- ❌ Erreur lors de la mise à jour du mot de passe → Vérifiez la complexité

---

### ✅ ÉTAPE 3: Login Final

#### Ce que fait le code:
```javascript
const { data, error } = await DJUNTA.sb.auth.signInWithPassword({
    email: 'william.farreaux@gmail.com',
    password: 'VotreNouveauMotDePasse'
});

if (!error) {
    // Sauvegarder dans localStorage
    localStorage.setItem('djunta_auth', 'true');
    localStorage.setItem('djunta_user', JSON.stringify(data.user));
}
```

#### Instructions:
1. **Cliquez** "Oui" quand on vous demande si vous avez réinitialisé le mot de passe
2. **Vérifiez** que l'email est: `william.farreaux@gmail.com`
3. **ENTREZ** le nouveau mot de passe que vous avez défini à l'étape 2
4. **Cliquez** sur le bouton "🔓 Se connecter"
5. **Observez** les logs et les informations de session

#### Vérifications localStorage:
1. **Ouvrez** les DevTools de votre navigateur (F12)
2. **Allez** dans l'onglet "Application" (Chrome) ou "Storage" (Firefox)
3. **Cliquez** sur "Local Storage" → votre domaine
4. **Vérifiez** la présence de:
   - `djunta_auth` = "true"
   - `djunta_user` = {objet JSON avec les données utilisateur}

#### ✅ Succès si:
- Le message "✅ Connexion réussie!" s'affiche
- Les informations de session sont affichées (User ID, Email, Token)
- Le localStorage contient les bonnes valeurs
- La console ne montre aucune erreur

#### Erreurs possibles à signaler:
- ❌ "Invalid login credentials" → Vérifiez le mot de passe
- ❌ "Email not confirmed" → Retournez à l'étape 1
- ❌ localStorage vide → Problème de sauvegarde de session
- ❌ Token absent → Problème d'authentification Supabase

---

## 🧪 Option 2: Test Manuel avec les Pages Originales

Si vous préférez tester avec les vraies pages de l'application:

### ÉTAPE 1: Signup
1. Ouvrez `http://localhost:8080/signup.html`
2. Entrez l'email: `william.farreaux@gmail.com`
3. Entrez le mot de passe: `TestPassword123!`
4. Cliquez "Criar Conta"
5. **⏸️ VÉRIFIEZ VOTRE EMAIL** et cliquez sur le lien de confirmation

### ÉTAPE 2: Password Reset
1. Ouvrez `http://localhost:8080/forgot-password.html`
2. Entrez l'email: `william.farreaux@gmail.com`
3. Cliquez "Enviar Link"
4. **⏸️ VÉRIFIEZ VOTRE EMAIL** et cliquez sur le lien de reset
5. Sur la page `reset-password-confirm.html`, définissez un nouveau mot de passe

### ÉTAPE 3: Login
1. Ouvrez `http://localhost:8080/login.html`
2. Entrez l'email: `william.farreaux@gmail.com`
3. Entrez votre nouveau mot de passe
4. Cliquez "ENTRAR"
5. Vérifiez que vous êtes redirigé vers `profile.html`
6. **Ouvrez DevTools** et vérifiez localStorage

---

## 📊 Rapport à Fournir

Après chaque étape, merci de me confirmer:

### ✅ ÉTAPE 1 - Signup
- [ ] Email de confirmation reçu? (Oui/Non)
- [ ] Délai de réception: _____ secondes/minutes
- [ ] Lien de confirmation fonctionne? (Oui/Non)
- [ ] Erreurs dans la console? (Oui/Non - détails si oui)

### ✅ ÉTAPE 2 - Password Reset
- [ ] Email de reset reçu? (Oui/Non)
- [ ] Délai de réception: _____ secondes/minutes
- [ ] Lien de reset fonctionne? (Oui/Non)
- [ ] Page reset-password-confirm.html charge? (Oui/Non)
- [ ] Nouveau mot de passe défini avec succès? (Oui/Non)
- [ ] Email correctement formaté en français? (Oui/Non)
- [ ] Erreurs dans la console? (Oui/Non - détails si oui)

### ✅ ÉTAPE 3 - Login
- [ ] Login réussi? (Oui/Non)
- [ ] Redirection vers profile.html? (Oui/Non)
- [ ] localStorage['djunta_auth'] = "true"? (Oui/Non)
- [ ] localStorage['djunta_user'] contient les données? (Oui/Non)
- [ ] Token d'accès présent? (Oui/Non)
- [ ] Erreurs dans la console? (Oui/Non - détails si oui)

---

## 🐛 Erreurs Détectées Pendant le Développement

### ❌ Bug Corrigé:
- **Fichier**: `signup.html` ligne 13
- **Problème**: Référence à `djunta-core.js` (fichier inexistant)
- **Solution**: Changé en `djunta-master.js`
- **Impact**: Sans ce fix, le signup ne fonctionnerait jamais car `DJUNTA.sb` n'était pas initialisé

### ⚠️ Limitations de l'environnement de test:
- CDN bloqués (Supabase, Tailwind CSS, Lucide icons)
- Appels API Supabase bloqués
- Nécessite un test en environnement réel

---

## 📞 Support

Si vous rencontrez des problèmes:
1. **Capturez** une capture d'écran de la console (F12 → Console)
2. **Copiez** tous les messages d'erreur
3. **Notez** à quelle étape l'erreur se produit
4. **Rapportez** ces informations pour investigation

---

## ✅ Validation Finale

Une fois tous les tests terminés avec succès, confirmez:
- [x] Le flux d'inscription fonctionne
- [x] Les emails sont reçus et fonctionnels
- [x] Le reset de mot de passe fonctionne
- [x] Le login avec les nouveaux identifiants fonctionne
- [x] La session est correctement sauvegardée dans localStorage
- [x] Aucune erreur critique dans la console

**Date de test**: __________
**Testeur**: __________
**Résultat global**: ✅ SUCCÈS / ❌ ÉCHEC
